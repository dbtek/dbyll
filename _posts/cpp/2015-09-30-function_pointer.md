---
layout: post
title: [c++] 함수 포인터 총 정리
categories: [cpp]
tags: [cpp,콜백,함수포인터]
---

c++ 의 문법중 대부분은 다른 oop 언의 문법과 큰 차이는 없지만, 함수 포인터는 연습이 되지 않으면 바로 써먹기 불편한점이 있다. 
그런데 , 함수 조차 포인터로 호출 할 수 있다는것은 종전의 언어들에서 찾아 볼 수 없는 유연함을 제공 할 것으로 기대한다.

사실 표현 방법이 조금 다를뿐 c# 의 메소드 델리게이트 , as3 의 var a = function(){...} 활용에 해당 하는것으로 파악 된다. 
동적객체에 적용하기 위해 * 연산자를 사용하는데 어순이 조금 이색적이다.




{% highlight csharp %}
//
//  main.cpp
//  FuntionPointerStudy
//
//  Created by SuperSc on 2015. 1. 7..
//  Copyright (c) 2015년 SuperSc. All rights reserved.
//

#include <iostream>
using namespace std;



//정적함수
void StaticFunction(int n)
{
    cout << "static function int : " << n << endl;
}



//네임스페이스 안의 정적 함수
namespace TestNameSpace {
    void InNameSpace(int n)
    {
        cout << "in namesapce static function : " << n << endl;
    }
}



// 클래스
class TestClass
{
    
    
private:
    string _name;
public:
    
    //클래스 안의 정적함수
    static void InClassStaticFuction(int n)
    {
        cout << "in class static function : " << n << endl;
    }
    
    
    TestClass(string name)
    {
        _name = name;
    }
    
    
    //클래스 함수들...
    void PrintInfo() const
    {
        cout << "in class infomation : " << _name << endl;
    }
    
    void InClass1(int n)
    {
        cout << "in class function 1 : " << n << endl;
    }
    
    void InClass2(int n)
    {
        cout << "in class function 2 : " << n << endl;
    }
    
    int Sum(int m , int n)
    {
        int _sum = m + n;
        return _sum;
    }
    
    string GetName() const
    {
        return _name;
    }
    
    
};








int main(int argc, const char * argv[]) {
    // insert code here...
    
    //정적함수 포인터 선언
    void (*staticFunctionPointer)(int);
    staticFunctionPointer = StaticFunction;
    staticFunctionPointer(20);
    
    
    //네임스페이스 안의 정적함수로 교체 (함수 모양이 같으면 치환이 가능하다)
    staticFunctionPointer = TestNameSpace::InNameSpace;
    staticFunctionPointer(30);
    
    
    //클래스의 정적함수로 교체
    staticFunctionPointer = TestClass::InClassStaticFuction;
    staticFunctionPointer(40);
    
    
    
    
    //
    //동적 객체 생성
    //
    TestClass * testObject1 = new TestClass("test_object_1");
    
    
    //활용 : 동적 객체의 -> 를 활용하여도 클래스의 정적 함수 사용가능
    staticFunctionPointer = testObject1->InClassStaticFuction;
    staticFunctionPointer(50);
    
    
    //에러 ! 동적 객체의 클래스 함수는 모양이 같더라도 정적함수 포인터로 사용 할 수 없다.
    //staticFunctionPointer = testObject1->InClass;
    
    
    //선언 : int 인수 1개를 사용하는 동적 객체용 함수 포인터 선언
    void(TestClass::*inClassFunctionPointer)(int);
    
    
    //활용 : 인수 1개 함수 포인터 활용
    inClassFunctionPointer = &TestClass::InClass1;
    (testObject1->*inClassFunctionPointer)(60);
    
    
    //활용 : 역시 함수 형태가 같은 같은 동적 객체의 함수도 치환이 가능하다.
    inClassFunctionPointer = &TestClass::InClass2;
    (testObject1->*inClassFunctionPointer)(70);
    
    
    //선언 : 동적 객체의 인수를 사용하지 않는 const 함수 포인터 선언
    void(TestClass::*inClassNoArgFunction)() const;
    
    
    //활용 : 동적 객체의 인수가 없는 함수 포인터 활용
    inClassNoArgFunction = &TestClass::PrintInfo;
    (testObject1->*inClassNoArgFunction)();
    
    
    //선언 : 동적 객체의 인수가 2개, 반환값이 int 인 함수 포인터 선언
    int(TestClass::*inClassDoubleArgFunction)(int,int);
    
    
    //활용 : 동적 객체의 인수 2개, 반환값이 int 인 함수 포인터 활용
    inClassDoubleArgFunction = &TestClass::Sum;
    int result_int = (testObject1->*inClassDoubleArgFunction)(80,90);
    cout<< "result : " << result_int << endl;
    
    
    //선언 : 동적 객체의 반환값이 string 인 함수 포인터 선언
    string(TestClass::*inClassReturnStringFunction)() const;
    
    
    //활용 : 동적 객체의 반환값이 string 인 함수 포인터 활용
    inClassReturnStringFunction = &TestClass::GetName;
    string result_string = (testObject1->*inClassReturnStringFunction)();
    cout << "result : " << result_string << endl;
    
    
    
    delete testObject1;
    testObject1 = nullptr;
    
    
    /* 출력내용
     
     static function int : 20
     in namesapce static function : 30
     in class static function : 40
     in class static function : 50
     in class function 1 : 60
     in class function 2 : 70
     in class infomation : test_object_1
     result : 170
     result : test_object_1
     
     */
    
    
    return 0;
}

{% endhighlight %}



edit - 15.01.12
c++ 11 부터 아래와 같이 using 을 이용해 간단히 함수 포인터를 선언 할 수 있다.
using EventListener = void(*)(void *  , TEventArg );


EventListener 라는 이름의 함수 포인터는 반환값이 없고 , void * 형과 TEventArg 형의 인자를 가진다.
