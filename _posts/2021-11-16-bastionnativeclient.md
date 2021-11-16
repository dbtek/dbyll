---
layout: post
title: Azure Bastion with Native Client
tags: [azurebastion,nativeclient,pipelines]
fullview: true
---

Greetings, All.

## News

So, Microsoft released a neat little update to Bastion at this years event at MS Ignite (Don't know what Bastion is, [here's a link](https://docs.microsoft.com/en-us/azure/bastion/bastion-overview))

They released the capability to directly from your Windows or Linux machine, via Az CLI connect directly to a Virtual Machine without having to browse the portal.
For me, working as a consultant, jumping betweens environments and browser tabs, this can be pretty frustrating.

## Solution

### Prerequisites

📌 Azure Bastion in Standard-tier

📌 Enable "Native client support" under Configurations

📌 Az CLI 2.30

📌 A Virtual Network

📌 A Virtual Machine in the Virtual Network

### Currently limitaions

📌 Custom protocol or port is not yet supported

📌 Signing in with an SSH private key stored in a Azure Key Vault.

📌 Signing in with local username and password (According to the documentation), **however** I was able to connection to my virtual machine with the local credentials.

### PowerShell script

I wrote the below script as a quick and dirty solution for helping people connect to Azure, select the Virtual Machine and then make the Az-command to connect to the Virtual Machine.

Please update the following variables to reflect your environment:

* $BastionName
* $BastionRG

``` PowerShell
az login
$SubscriptionName = az account list --query "[].{Name:name}" -o tsv | Out-GridView -PassThru

az account set -s $SubscriptionName

Clear-Host

$VM = Read-Host "VM Name?"
$BastionName = "n-bastion-01"
$BastionRG = "n-infra-rg"

$VMId = az vm list --query "[?name=='$VM'].id" -o tsv

az network bastion rdp --name $BastionName --resource-group $BastionRG --target-resource-id $VMId
```

![2021-11-16-bastionnativeclient-1](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-1.png)

![2021-11-16-bastionnativeclient-2](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-2.png)

![2021-11-16-bastionnativeclient-3](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-3.png)

![2021-11-16-bastionnativeclient-4](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-4.png)

![2021-11-16-bastionnativeclient-5](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-5.png)

![2021-11-16-bastionnativeclient-6](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-6.png)

![2021-11-16-bastionnativeclient-7](https://raw.githubusercontent.com/egullbrandsson/egullbrandsson.github.io/master/assets/media/2021-11-16-bastionnativeclient/2021-11-16-bastionnativeclient-7.png)