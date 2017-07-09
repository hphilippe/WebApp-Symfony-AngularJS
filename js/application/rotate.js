$(function(){
	moveBg();
})

function moveBg(){
	var $b1 = $('.gear1 p');
	var $b2 = $('.gear2 p');

	$b1.eq(0).velocity({rotateZ:'360deg'},{
		duration:2000,
		delay:8000,
		easing: 'easeInOutQuart',
		loop:true,
		complete:function(){
			//$(this).velocity({rotateZ:'0deg'},0);
		}
	})
	rotate($b1.eq(1))


	$b2.eq(0).velocity({rotateZ:'360deg'},{
		duration:2000,
		delay:8000,
		easing: 'easeInOutQuart',
		loop:true,
		complete:function(){
			//$(this).velocity({rotateZ:'0deg'},0);
		}
	})
	$b2.eq(2).velocity({rotateZ:'360deg'},{
		duration:2000,
		delay:8000,
		easing: 'easeInOutExpo',
		loop:true,
		complete:function(){
			//$(this).velocity({rotateZ:'0deg'},0);
		}
	})
	rotate($b2.eq(1));

	function rotate($t){
		$t.velocity({rotateZ:'-360deg'},{
			duration:2000,
			delay:8000,
			easing:'easeInOutQuart',
			complete:function(){
				$t.velocity({rotateZ:0},0)
				rotate($t)
			}
		})
	}


}