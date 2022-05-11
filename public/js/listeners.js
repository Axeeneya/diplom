// слушатель клика для кнопки "показать камеры"
$(document).ready(function(){
	$('#showCams').click(function(){ 
		$('#showCams').toggleClass('hidden');
		$('#delCams').toggleClass('hidden');
		getCams();
	});
});

// слушатель клика для кнопки "скрыть камеры"
$(document).ready(function(){
	$('#delCams').click(function(){ 
		for (var i = 0; i < myPlacemarks.length; i++) {
			myMap.geoObjects.remove(myPlacemarks[i]);
		}
		$('#showCams').toggleClass('hidden');
		$('#delCams').toggleClass('hidden');

	});
});

// слушатель клика для кнопки "full скрин" на карте
$(document).ready(function(){
	$('.fullscreenBtn').click(function(){ 
		$('.fullscreenBtn').toggleClass('hidden');
		$('#map').toggleClass('fullscreenMap');
		$('.lowscreenBtn').toggleClass('hidden');
		myMap.container.fitToViewport();
	});
});

// слушатель клика для кнопки "low скрин" на карте
$(document).ready(function(){
	$('.lowscreenBtn').click(function(){ 
		$('.fullscreenBtn').toggleClass('hidden');
		$('#map').toggleClass('fullscreenMap');
		$('.lowscreenBtn').toggleClass('hidden');
		
		myMap.container.fitToViewport();
	});
});

$(document).ready(function(){
	$('.checkbox').click(function(){ 
		$('.listPoints').toggleClass('show');
	});
});

$(document).ready(function(){
	$('#delLines').click(function(){ 

		dellAllLines();
	});
});

$(document).ready(function(){
	$('#showLines').click(function(){ 

		showAllLines();
	});
});

function createListener(line){
    $(document).ready(function(){
        $('#lineShow'+line.id).click(function(){ 
            $('#lineShow'+line.id).toggleClass('hidden');
            $('#lineDel'+line.id).toggleClass('hidden');
            showLine(line.id);
        });
    });
    $(document).ready(function(){
        $('#lineDel'+line.id).click(function(){ 
            $('#lineShow'+line.id).toggleClass('hidden');
            $('#lineDel'+line.id).toggleClass('hidden');
            removeLine(line.id);
        });
    });
}

$(document).ready(function(){
	$('.lightThemebtn').click(function(){ 
		$('body').addClass('themeDark');
		$('body').removeClass('themeLight');
	});
});

$(document).ready(function(){
	$('.darkThemebtn').click(function(){ 
		$('body').removeClass('themeDark');
		$('body').addClass('themeLight');

	});
});