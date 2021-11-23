---
layout: post
title: Azure Bastion with Native Client
tags: [azurebastion,nativeclient,pipelines]
fullview: true
---

Greetings, All.

## News

So, Microsoft released a neat little update to Bastion at this years MS Ignite event. (Don't know what Bastion is, [here's a link](https://docs.microsoft.com/en-us/azure/bastion/bastion-overview))

They released the capability to directly from your Windows or Linux machine, via Az CLI connect directly to a Virtual Machine without having to browse the portal.
For me, working as a consultant, jumping betweens environments and browser tabs, this can be pretty frustrating.

## Solution

This post will go through a small script that you can re-use for connecting from your native client to VM's via Bastion.

### Prerequisites

📌 Azure Bastion in Standard-tier

📌 Enable "Native client support" under Configurations

📌 Az CLI 2.30

📌 A Virtual Network

📌 A Virtual Machine in the Virtual Network

### Currently limitaions

📌 Custom protocol or port is not yet supported

📌 Signing in with an SSH private key stored in a Azure Key Vault is not supported.

📌 Signing in with local username and password (According to the documentation), **however** I was able to connection to my virtual machine with the local credentials. (Windows, RDP)

### PowerShell script

I wrote the below script as a quick solution for helping people connect to Azure, select the Virtual Machine and then make the Az-command to connect to the Virtual Machine.

Please update the following variables to reflect your environment:

* $BastionName
* $BastionRG

``` PowerShell
# Provide some information on where the bastion lives
$BastionName = "n-bastion-01"
$BastionRG = "n-infra-rg"

# Login to Azure
az login

# Select subscription where the VM you want to access lives
$VMSubscriptionName = az account list --query "[].{Name:name}" -o tsv | Out-GridView -PassThru -Title "Select the subscription where the VM you want to access lives"

# Switch subscription to VM-subscription
az account set -s $VMSubscriptionName

Clear-Host

# Select the VM you want to connect to
$VMName = az vm list --query "[].{Name:name}" -o tsv | Out-GridView -PassThru -Title "Select the VM you want to connect to"
$VMId = az vm list --query "[?name=='$VMName'].id" -o tsv

# Select the subscription where bastion lives
$SubscriptionName = az account list --query "[].{Name:name}" -o tsv | Out-GridView -PassThru -Title "Select the subscription where the Bastion host(s) lives"

# Switch subscription to Bastion-subscription
az account set -s $SubscriptionName

Clear-Host

# Make the noice!
az network bastion rdp --name $BastionName --resource-group $BastionRG --target-resource-id $VMId
```

### Prerequisites for SSH

📌 Enable System Assigned Identity on your Virtual Machine

📌 Make sure that the AADSSHLoginForLinux-extension is installed on the VM(s)

📌 If you haven't used SSH via Az CLI before, make sure to install the extension locally by running

``` PowerShell
az extension add --name ssh
```

Use one of the below alternatives (just replace the last line in the script)

``` PowerShell
# Here we are using AAD to authenticate against the VM
az network bastion ssh --name $BastionName --resource-group $BastionRG --target-resource-id $VMId --auth-type "AAD"
```

``` PowerShell
# Here we are using a local SSH key to authenticate against the VM
az network bastion ssh --name $BastionName --resource-group $BastionRG --target-resource-id $VMId --auth-type "ssh-key" --username "xyz" --ssh-key "C:\filepath\sshkey.pem"
```

For more information about this, here's a [link to docs](https://docs.microsoft.com/en-us/azure/bastion/connect-native-client-windows)

### Get started template

If you don't have a bastion host, subnet or public ip, here's a Bicep Template do get you started. It does however require you to have a virtual network and I'll not go into any details regarding the template.

``` PowerShell
// Bastion
param bastionName string
param location string = resourceGroup().location

// Bastion Subnet
@description('the vnet where the bastion subnet will live')
param vnetName string
param subnetPrefix string

// Public IP
param publicIPName string

resource publicIP 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: publicIPName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Regional'
  }
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Static'
    idleTimeoutInMinutes: 4
  }
}

resource vnetResource 'Microsoft.Network/virtualNetworks@2021-03-01' existing = {
  name: vnetName
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2021-03-01' = {
  name: 'AzureBastionSubnet'
  parent: vnetResource
  properties: {
    addressPrefix: subnetPrefix
  }
}

resource bastion 'Microsoft.Network/bastionHosts@2020-11-01' = {
  name: bastionName
  location: location
  properties: {
    dnsName: bastionName
    ipConfigurations: [
      {
        name: 'IpConf'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicIP.id
          }
          subnet: {
            id: subnet.id
          }
        }
      }
    ]
  }
}

```

That's it.

Thanks for reading, if you have any feedback, let me know!
