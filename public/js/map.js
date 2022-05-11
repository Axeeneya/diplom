ymaps.ready(init);  // загрузка api яндекс карт

let myPlacemarks = [];   
let myLinesPoints = [[]]; // массив для хранения точек траекторий [траектория 1: [точка 1, точка 2], траетория 2:[точка 1, точка 2]
let myLinesPointsTemp = []; // временный массив для хранения точек траектории
let myLines = []; // массив 
let myPointsTemp = []; // массив для хранения информации об одной точке 
let myPoints = [[]]; // массив для хранения всех точек
let showLines = []; // масив для хранения информации об атрибуте visible траектории

var myMap; // переменная для карты


// функция скрытия линий
function dellAllLines(){
    for (var i = 0; i<showLines.length;i++){
        if (showLines[i] == "yes"){
            removeLine(i+1);
            $('#lineShow'+(i+1)).toggleClass('hidden');
            $('#lineDel'+(i+1)).toggleClass('hidden'); 
        }
    }
}

// функция для показа линий
function showAllLines(){
    for (var i = 0; i<showLines.length;i++){
        if (showLines[i] == "no"){
            showLine(i+1);
            $('#lineShow'+(i+1)).toggleClass('hidden');
            $('#lineDel'+(i+1)).toggleClass('hidden');
        }
    }
}

// функция добавления точек с api в массив
async function getPoints(){
    const responsePoint = await fetch("http://localhost:3000/api/points", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }
    }); 
    if (responsePoint.ok === true) {
        const points = await responsePoint.json();
        points.forEach(point => {
            myPointsTemp.push(point.id);
            myPointsTemp.push(point.coordinates);
            var code = toBase64(point.image.data);
            myPointsTemp.push(code); 
            myPointsTemp.push(point.date);
            myPoints.push(myPointsTemp); 
            myPointsTemp = [];
        });
    }
}

// функция декодирования buffer кода изображения в Base64
function toBase64(arr) {
    return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
}

// получение линий по API
async function getLines() {
    const responseLines = await fetch("http://localhost:3000/api/lines", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }

    }); 
    if (responseLines.ok === true) {
        const lines = await responseLines.json();
        lines.forEach(line => {
            addLine(line);
        });
    }
}

// получение Камер по API
async function getCams() {
    const response = await fetch("http://localhost:3000/api/cameras", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }
    }); 
    if (response.ok === true) {
        const cameras = await response.json();
        cameras.forEach(camera => {
            addCam(camera);
        });
    }
}

// удаление линии по id
function removeLine(id){
    myMap.geoObjects.remove(myLines[id-1]); 
    for (var i = 0; i<myLinesPoints[0][id-1].length; i++){
        myMap.geoObjects.remove(myLinesPoints[0][id-1][i]);
    }
    showLines[id-1] = "no";
    var yesPoint = 0;
    var noPoint = 0;
    for (var i = 0; i<showLines.length;i++){
        if (showLines[i] == "yes"){
            yesPoint = 1;

        }
        else {
            noPoint = 1;
        }
    }
    if (yesPoint == 0){
        $('#delLines').addClass('hidden');
    } else {
        $('#delLines').removeClass('hidden');
    }
    if (noPoint == 0){
        $('#showLines').addClass('hidden');
    } else {
        $('#showLines').removeClass('hidden');
    }
}
// показ линии по id
function showLine(id){
    myMap.geoObjects.add(myLines[id-1]); 
    for (var i = 0; i<myLinesPoints[0][id-1].length; i++){
        myMap.geoObjects.add(myLinesPoints[0][id-1][i]);
    }
    showLines[id-1] = "yes";
    var yesPoint = 0;
    var noPoint = 0;
    for (var i = 0; i<showLines.length;i++){
        if (showLines[i] == "yes"){
            yesPoint = 1;

        }
        else {
            noPoint = 1;
        }
    }
    if (yesPoint == 0){
        $('#delLines').addClass('hidden');
        console.log("ноу поинт = 0");
    } else {
        $('#delLines').removeClass('hidden');
    }
    if (noPoint == 0){
        $('#showLines').addClass('hidden');
    } else {
        $('#showLines').removeClass('hidden');
    }

}

function addLine(line){
    showLines.push("yes");
    var points = JSON.parse(line.points); 
    var coordinateLine = '[';
    for (var i = 1; i <= points.length; i++){
        var id = points[i-1];
        console.log(id);
        var data = [];     
        var getData = myPoints[id][3]; 

        if (getData != null) {
            while (getData.slice(-1) != '.'){
                getData=getData.slice(0, -1);
            }
            getData=getData.slice(0, -1);
            data = getData.split('T');
        } else {
            data[0] ='Дата не указана';
            data[1] ='Время не указано';
        }
        
        var coordinates = JSON.parse(myPoints[id][1]); 
        coordinateLine += '['+coordinates+'],';
        var image = myPoints[id][2];
        var myPlacemark = new ymaps.Placemark(coordinates, {
            balloonContentHeader: "Информация о метке", // заголовок
            balloonContentBody: '<img class="imgPoint"id="'+(i+1)+'" src="data:image/jpg;base64,'+image+'"/>'+'<div>Дата:'+data[0]+'<br/>Время:'+data[1]+'</div>', // содержание
            balloonContentFooter: '', // подвал
            hintContent: "точка №" + i,  // информация при наведении
        }, 
        {                
            iconLayout: 'default#imageWithContent', // использование своей картинки
            iconImageHref: 'images/marker.png', // ссылка на картинку
            iconImageSize: [20, 20], // размер маркера
            iconImageOffset: [-10, -10], // смещение изображения
            iconContentLayout: MyIconContentLayout, // шаблон блока
        });      
        myLinesPointsTemp.push(myPlacemark); // добавление точки в временный массив
        myMap.geoObjects.add(myPlacemark); // размещение точки на карте
    }
    coordinateLine=coordinateLine.slice(0, -1);

    coordinateLine += ']';
    coordinateLine = JSON.parse(coordinateLine);

    var geometry = coordinateLine,
    properties = {
            hintContent: "линия " + line.id //текст при наведении мыши
        },
        options = {
            draggable: false, //возможность перемещения
            strokeColor: '#583454', //цвет
            strokeWidth: 4 //толщина
        },
        polyline = new ymaps.Polyline(geometry, properties, options);

    myLines.push(polyline); // добавление линии в массив
    myMap.geoObjects.add(polyline); // размещение линии на карте


    myLinesPoints[0].push(myLinesPointsTemp); // добавление всех точек линии в массив
    myLinesPointsTemp = []; // очистка временного массива
    var ul = document.getElementById("list"); // поиск списка панели управления
    var li = document.createElement("li"); // создание нового пункта
    var i = document.createElement("i");
    i.setAttribute("class", "fa-solid fa-eye-slash");
    li.appendChild(i);
    li.setAttribute("id", "lineDel" + line.id); // задание id тегу
    li.appendChild(document.createTextNode(' скрыть линию ' + line.id)); // задание текста тегу
    ul.appendChild(li); // добавление в список


    var li = document.createElement("li"); // создание нового пункта
    li.setAttribute("id", "lineShow" + line.id);// задание id тегу
    li.setAttribute("class", "hidden");// задание id класса
    var i = document.createElement("i");
    i.setAttribute("class", "fa-solid fa-eye");
    li.appendChild(i);
    li.appendChild(document.createTextNode(' показать линию ' + line.id)); // задание текста тегу
    ul.appendChild(li); // добавление в список
    createListener(line);
}

//добавление камер с API в бд и размещение на карте
function addCam(camera) {
    var myPlacemark = new ymaps.Placemark([camera.firstPos, camera.secondPos], {
        balloonContentHeader: "Камера " + camera.id, // заголовок
        balloonContentBody: "Расположение: " + camera.addres, // содержимое
        balloonContentFooter: '', // подвал
        hintContent: "Камера " + camera.id,  // информация при наведении мыши

    }, 
    {                
        iconLayout: 'default#imageWithContent', // параметр: моё изображение на метку
        iconImageHref: 'images/cam.png', // ссылка на изображение
        iconImageSize: [40, 40], // размер метки

        iconImageOffset: [-20, -20], // смещение изображения
        iconContentLayout: MyIconContentLayout, // шаблон

    });
    myPlacemarks.unshift(myPlacemark); // добавление в массив

    myMap.geoObjects.add(myPlacemark); // добавление на карту
        myPlacemark.options.set('iconImageRotation', camera.rotate);


}

function init() {

    myMap = new ymaps.Map("map", 
    {
        controls: ['default'], // контролеры с яндекс карты
        center: [43.972, 56.3087], // позиция Н.Новгорода
        zoom: 13, // Зум на карте

    } , {
            geoObjectOverlayFactory: 'default#interactiveGraphics'
        }),
    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        );
    myMap.controls.add('zoomControl');
    myMap.behaviors.enable(['scrollZoom']);
    getPoints();
    getCams();
    getLines();
    
}