import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

import angular from 'angular';
// import "popper.js";
// import 'bootstrap/dist/js/bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "./scss/main.scss";

var entitled = null; 
if (document.location.hostname == "localhost") {
    var theLink = 'http://localhost:27080';
} else {
    var theLink = 'https://cigna2020backend.appspot.com/';
}

var cigna2020App = angular.module('cigna2020', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
cigna2020App.controller('cigna2020Controller', function cigna2020Controller($scope, $timeout) {

    $scope.stage = 1 ;
   
    $scope.loading = false;
    $scope.q1 = "";
    $scope.q1_1 = 0;
    $scope.q1_2 = 0;
    $scope.q1_3 = 0;
    $scope.q1_4 = 0;
    $scope.q1_5 = 0;
    $scope.regFormError = {
        q1: false,
        q2: false,
        lastname : false,
        firstname : false,
        sex : false,
        mobile : false,
        email : false,
        tnc :false
    } ;
    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validateName(name) { 
        var re = /^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/;
        return re.test(name);
    }
    function validatePhone(phone) { 
        var re = /^1[0-9]{10}$|^[56789][0-9]{7}$/;
        return re.test(phone);
    }
    function validateDirtywords(text) { 
        // var words = ['屌','屄','撚','閪','死','柒','吊','龜','屎','尿','垃圾','廢青','臭西','八婆','你老味','你老母','冚家剷','掰㞗掰','戇㞗㞗','仆街','打飛機','硬膠膠'];
        
        var chiniese_re= /(\u5C44)|(\u5C4C)|(\u649A)|(\u95AA)|(\u6B7B)|(\u67D2)|(\u540A)|(\u9F9C)|(\u5C4E)|(\u5C3F)|(\u5783\u573E)|(\u5EE2\u9752)|(\u81ED\u897F)|(\u516B\u5A46)|(\u4F60\u8001\u5473)|(\u4F60\u8001\u6BCD)|(\u519A\u5BB6\u5277)|(\u519A\u5BB6\u5277)|(\u63B0\u3797\u63B0)|(\u6207\u3797\u3797)|(\u4EC6\u8857)|(\u6253\u98DB\u6A5F)|(\u786C\u81A0\u81A0)|(ass|damn|shit|fuck)/ ; 
        // var re =/(\W)(ass|bottom|damn|shit|fuck)(\W)/ ;
        return chiniese_re.test(text);
    }
    function gaEventcall(action, category, label, value){
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function chunk(str, n) {
        var ret = [];
        var i;
        var len;
    
        for(i = 0, len = str.length; i < len; i += n) {
           ret.push(str.substr(i, n))
        }
    
        return ret
    };

    $scope.urlstage5 = function(url){
        gaEventcall('clientlink','click','to_cigna','to_cigna');
        window.open('https://www.cigna.com.hk/zh-hant/our-insurance-solutions/vhis/', '_blank');
    }
  
    $scope.tostage2 = function () {
        $timeout(function () {
            $scope.stage = 2;
            $scope.$apply();
        }, 0);
    };  
    $scope.tostage3 = function () {
        $timeout(function () {
            $scope.stage = 3;
            $scope.$apply();
        }, 0);
       
    };  
    $scope.tostage4 = function() {
        var errormsg = ""; 
        $scope.q1="" ; 
        if($scope.q1_1){
            $scope.q1 = "A";
        }
        if($scope.q1_2){
            $scope.q1 = $scope.q1 +  "B";
        }
        if($scope.q1_3){
            $scope.q1 = $scope.q1 +  "C";
        }
        if($scope.q1_4){
            $scope.q1 = $scope.q1 +  "D";
        }
        if($scope.q1_5){
            $scope.q1 = $scope.q1 +  "E";
        }
        if($scope.q1==""){
            errormsg = errormsg + "請選擇問題1\n"; 
        }
        if(!$scope.q2){
            errormsg = errormsg + "請輸入問題2\n"; 
        }else{
            if( validateDirtywords($scope.q2)){
                errormsg = errormsg + "請勿輸入粗言穢語\n"; 
            }
        }
        
        if (errormsg !=""){
            alert(errormsg);
        }else{
            $scope.q1 = chunk($scope.q1, 1).join(',');
            console.log($scope.q1);
            $timeout(function () {
                $scope.stage = 4;
                $scope.$apply();
            }, 0);
        }
    }

    $scope.pickquestion = function(pick) {
        // $( "#questionimg1" ).attr("src","public/q1_1.png");
        // $( "#questionimg2" ).attr("src","public/q1_2.png");
        // $( "#questionimg3" ).attr("src","public/q1_3.png");
        // $( "#questionimg4" ).attr("src","public/q1_4.png");
        // $( "#questionimg5" ).attr("src","public/q1_5.png");
        var filename = parseInt(pick); 
        $( "#questionimg"+pick ).attr("src","public/q1_"+ filename +"_on.png");
     
        switch(pick) {
            case 1:
                if ($scope.q1_1==0){
                    $scope.q1_1=1; 
                }else{
                    $( "#questionimg1" ).attr("src","public/q1_1.png");
                    $scope.q1_1=0; 
                }
              break;
            case 2:
                if ($scope.q1_2==0){
                    $scope.q1_2=1; 
                }else{
                    $( "#questionimg2" ).attr("src","public/q1_2.png");
                    $scope.q1_2=0; 
                }
              break;
            case 3:
                if ($scope.q1_3==0){
                    $scope.q1_3=1; 
                }else{
                    $( "#questionimg3" ).attr("src","public/q1_3.png");
                    $scope.q1_3=0; 
                }
              break;
            case 4:
                if ($scope.q1_4==0){
                    $scope.q1_4=1; 
                }else{
                    $( "#questionimg4" ).attr("src","public/q1_4.png");
                    $scope.q1_4=0; 
                }
              break;
            case 5:
                if ($scope.q1_5==0){
                    $scope.q1_5=1; 
                }else{
                    $( "#questionimg5" ).attr("src","public/q1_5.png");
                    $scope.q1_5=0; 
                }
              break;
            default:
                $scope.q1="" ;
         }
    }


    $scope.submitToServer = function () {
        $scope.regFormError = {
            lastname : false,
            firstname : false,
            sex : false,
            mobile : false,
            email : false,
            tnc :false
        } ;
        $timeout(function () {
            $scope.loading = true;
            $scope.$apply();
        }, 0);
        if (!$scope.lastname || $scope.lastname==""){
            $scope.regFormError.lastname = true ; 
        }else{
            if (! validateName($scope.lastname)){
                $scope.regFormError.lastname = true ; 
            }
        }
        if (!$scope.firstname || $scope.firstname==""){
            $scope.regFormError.firstname = true ; 
        }else{
            if (! validateName($scope.firstname)){
                $scope.regFormError.firstname = true ; 
            }
        }
        if (!$scope.sex){
            $scope.regFormError.sex = true ; 
         }
        if (!$scope.mobile || $scope.mobile==""){
            $scope.regFormError.mobile = true ; 
         }else{
            if(! validatePhone($scope.mobile)){
                $scope.regFormError.mobile = true ; 
            }
         }
         
         if (!$scope.email || $scope.email==""){
            $scope.regFormError.email = true ; 
         }else{
             if(! validateEmail($scope.email)){
                $scope.regFormError.email = true ; 
             }
         }
         if (!$scope.promotion){
            $scope.regFormError.tnc = true ; 
         }
         if (!$scope.tnc){
            $scope.regFormError.tnc = true ; 
         }
        console.log( $scope.regFormError);
        
        // console.log($scope.regForm);
        // if (incorrectInput()) {
        //     console.log('incorrect');
        //     return;
        // }
        if (!$scope.regForm.$invalid && !$scope.regFormError.lastname && !$scope.regFormError.firstname && !$scope.regFormError.mobile && !$scope.regFormError.email && !$scope.regFormError.tnc ) {
            
            console.log('valid');
            var payload = {};
            payload['lastname'] =  $scope.lastname.toUpperCase(); ;
            payload['firstname'] =  $scope.firstname.toUpperCase(); ;
            payload['mobile'] =  $scope.mobile ;
            payload['sex'] =  $scope.sex ;
            payload['email'] = $scope.email ;
            payload['promotion'] = $scope.promotion ;
            payload['tnc'] =  $scope.tnc ;
            payload['q1'] = $scope.q1 ;
            payload['q2'] = $scope.q2 ;

            //
            if (window.console) {
                // console.log(payload);
            }


            $.post(theLink + '/submit', payload, function (response) {
                if (window.console) {
                    console.log(response)
                }
                if (response.status == "Success") {
                    $timeout(function () {
                        $scope.loading = false;
                        $scope.stage = 5;
                        $scope.$apply();
                    }, 0);
                } else if (response.status == "Duplicated") {
                    $timeout(function () {
                        $scope.loading = false;
                        $scope.$apply();
                    }, 0);
                    alert("你的電話號碼已經登記，多數參加");
                } else if (response.status == "QUOTA-FULL") {

                } else {

                }

            }, "json").fail(function () {

                if (window.console) {
                    console.log("Server Error")
                }
            }, "json");
        }else{
            $timeout(function () {
                $scope.loading = false;
                $scope.$apply();
            }, 0);
        }
    }

});



function init() {

}



$(document).ready(function () {
    

});