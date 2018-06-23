// JavaScript Document
(function(win){
    var degDivide = 45;
    var prizeName;
    var prizeTypeArr = ['一等奖','三等奖','继续加油！','二等奖','参与奖'];
    var prizeTypeDegArr = [[300],[180],[240,0],[60],[120]];
    var disk = {
        prizeType : 0,
        nowDeg : 0,
        willDeg : 0,
        weixinId : null,
        contentId : null,
        turnFlag : true,
        count : null,
        init : function(id,contentid,count,flag){
            var t = this;
            divPointer.onclick = function(){
//                      t.nowDeg = t.nowDeg%360;
//                      /*webkit*/
//                      divPointer.style.webkitTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
//                      divPointer.style.webkitTransitionDuration = '4s'
//                      divPointer.style.webkitTransitionProperty = 'width';
//                      divPointer.style.webkitTransform = 'rotate('+ t.nowDeg +'deg)';
//                      /*ie*/
//                      divPointer.style.msTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
//                      divPointer.style.msTransitionDuration = '4s'
//                      divPointer.style.msTransitionProperty = 'width';
//                      divPointer.style.msTransform = 'rotate('+ t.nowDeg +'deg)';
                t.lottery();
            }
        },
        lottery: function(){
            var t = this;
                t.prizeType= t._rand();
                t._judge();
        },
        //获取范围内的随机数
         _rand: function (){
            var max=4;
            var min=0;
            return Math.floor(min+Math.random()*(max-min));
        },
        _judge: function(){
            var t = this,
            judgeArr = prizeTypeDegArr[t.prizeType],
            judgeArrLen = judgeArr.length;

            if(judgeArrLen == 1){
                t.willDeg = 1080 + judgeArr[0] + 2 + (degDivide-4)*Math.random();
                prizeName = prizeTypeArr[t.prizeType];
            }else if(judgeArrLen > 1){
                var judgeArrRan =Math.floor(judgeArrLen * Math.random());
                t.willDeg = 1080 + judgeArr[judgeArrRan] + 2 + (degDivide-4)*Math.random();
                prizeName = prizeTypeArr[t.prizeType];
            }else{
                return;
            }
            t._turn();
        },
        _turn : function(){
            var t = this;
            setTimeout(function(){
                divPointer.style.webkitTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
                divPointer.style.webkitTransitionDuration = '4s'
                divPointer.style.webkitTransitionProperty = 'all';
                divPointer.style.webkitTransform = 'rotate('+ t.willDeg +'deg)';

                divPointer.style.msTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
                divPointer.style.msTransitionDuration = '4s'
                divPointer.style.msTransitionProperty = 'all';
                divPointer.style.msTransform = 'rotate('+ t.willDeg +'deg)';

                //t.nowDeg = t.willDeg;
            },100);
            setTimeout(function(){
                var clss;
                clss = "noPreize";
                t.myAlert('',prizeName,'ok',function(){
                    divPointer.style.webkitTransitionProperty = 'width';
                    divPointer.style.webkitTransform = 'rotate(0deg)';

                    divPointer.style.msTransitionProperty = 'width';
                    divPointer.style.msTransform = 'rotate(0deg)';

                    t.turnFlag = true;
                },clss);
            },4100)
        },
        tels : function(){
            var t = this;
            t.myPrompt('请填写手机号!','','确定','取消',function(){
                var telNum = $('.my_prompt_text input').val();
                var telephone_regx = /^(((13[0-9]{1})|14[0-9]{1}|15[0-9]{1}|18[0-9]{1})\d{8})$/;
                if(telNum == '' || !telephone_regx.exec(telNum)){
                    t.myAlert('','填写正确手机号','ok',function(){
                        t.tels();
                    });
                }else{
                    //Ajax提交手机号码
                    $.ajax({
                        type:"POST",
                        success:function(json){
                            var data = $.parseJSON(json);
                            var submitFlag = data.submit;
                            if(submitFlag == 'succeed'){
                                t.myAlert('','提交成功！','ok',function(){
                                    $('.my_prompt').hide();
                                    t.turnFlag = true;
                                });
                            }else{
                                t.myAlert('','提交失败！','ok',function(){
                                    t.tels();
                                });
                            }
                        },
                        error:function(){
                            t.myAlert('','请检查网络！','ok',function(){
                                t.tels();
                            });
                        },
                        timeout:'5000',
                        url:'/weixin/front_index.inc.php?type=turntable&action=submit',
                        data:{id:t.wenxinId,contentid:t.contentId,telephone:telNum}
                    })
                }
            },function(){
                t.turnFlag = true;
                return;
            });
        },
        getPrize : function(){
            var t = this;
            $('.getIt').hide();
            divPointer.style.webkitTransitionProperty = 'width';
            divPointer.style.webkitTransform = 'rotate(0deg)';

            divPointer.style.msTransitionProperty = 'width';
            divPointer.style.msTransform = 'rotate(0deg)';

            t.tels();
        },
        myAlert : function(title,text,btnText,fn,cls){
            $('.my_alert').hide();
            $('.my_alert_title').html(title);
            $('.my_alert_text').html(text);
            if(btnText == '') btnText = 'ok';
            $('.my_alert_btn input').val(btnText);
            $('.my_alert_btn input').click(function(){
                $('.my_alert').hide();
                fn();
            });
            if(cls == '' || cls == undefined){
                 $('.my_alert').attr('class','my_alert');
            }else{
                $('.my_alert').attr('class','my_alert ' + cls);
            }
            $('.my_alert').show();
        },
        myPrompt : function(title,text,btnTextY,btnTextN,fnY,fnN){
            $('.my_prompt').hide();
            $('.my_prompt_title').html(title);
            //$('.my_prompt_text').html(text);
            if(btnTextY == '') btnTextY = 'ok';
            if(btnTextN == '') btnTextN = 'no';
            $('.my_prompt_btnY').val(btnTextY).click(function(){
                $('.my_prompt').hide();
                fnY();
            });
            $('.my_prompt_btnN').val(btnTextN).click(function(){
                $('.my_prompt').hide();
                fnN();
            });
            $('.my_prompt').show();
        }
    }
    win.disk = disk;
})(window)