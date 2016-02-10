/**
	Green : booked seat
	Red   : Currently Selected seat
	Grey  : Available seat

**/
function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			myData = JSON.parse(xhttp.responseText, function(key, value) {
				var type;
				if (value && typeof value === 'object') {
					type = value.type;
					if (typeof type === 'string'
							&& typeof window[type] === 'function') {
						return new (window[type])(value);
					}
				}
				return value;
			});

			var movieSelector = document.createElement("SELECT");
			var option1 = document.createElement("option");
			option1.text = "";
			option1.value = "";
			movieSelector.add(option1);
			for (var i = 0; i < myData.Addresses.length; i++) {
				var option1 = document.createElement("option");
				option1.text = myData.Addresses[i].movieName;
				option1.value = myData.Addresses[i].id;
				movieSelector.add(option1);
			}
			movieSelector.addEventListener("change", function() {
				loadShowsForAMovie(this.value);
			});
			var listOfMovies = document.getElementById("listOfMovies");
			listOfMovies.appendChild(movieSelector);
		}
	};
	xhttp.open("POST", "shows", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

function loadShowsForAMovie(str) {

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {

		console.log("state changed");

		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var showTimesData = JSON.parse(xhttp.responseText, function(key,
					value) {
				var type;
				if (value && typeof value === 'object') {
					type = value.type;
					if (typeof type === 'string'
							&& typeof window[type] === 'function') {
						return new (window[type])(value);
					}
				}
				return value;
			});

			console.log(showTimesData);
			console.log(showTimesData.ShowTimes);
			var showSelector = document.createElement("SELECT");
			var option1 = document.createElement("option");
			option1.text = "";
			option1.value = "";
			showSelector.add(option1);
			for (var i = 0; i < showTimesData.ShowTimes.length; i++) {
				var option1 = document.createElement("option");
				option1.text = showTimesData.ShowTimes[i].showTime;
				option1.value = showTimesData.ShowTimes[i].id;
				showSelector.add(option1);
			}
			showSelector.addEventListener("change", function() {
				loadSeatsForThisShow(this.value);
			});
			var listOfShowsTimes = document.getElementById("listOfShowsTimes");
			listOfShowsTimes.appendChild(showSelector);
		}
	};

	console.log("def done");
	xhttp.open("POST", "getShowTimes", true);
	console.log("opened");
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
	console.log("sent");
}

loadSeatsForThisShow('gajni');
function loadSeatsForThisShow(str) {
	var m = 10;
	var n = 20;
	var seat;
	var divEl
	var btnTxt;
	var mat = document.getElementById("seatsMatrix");
	console.log("new");
	for (var i = 0; i < m; i++) {
		// Add tr
		for (var j = 0; j < n; j++) {
			btnTxt = String.fromCharCode(65 + i) + j;
			// console.log(btnTxt);
			seat = document.createElement("td")
			seat.setAttribute("class", "btn");
			divEl = document.createElement("div");
			divEl.setAttribute("id", btnTxt);
			//divEl.setAttribute("id", btnTxt);
			divEl.appendChild(document.createTextNode(btnTxt));			
//			divEl.addEventListener("click", function(){
//				seatSelected(this);
//			} );
//			
			seat.appendChild(divEl);
			
			// console.log(seat);
			
			mat.appendChild(seat);
		}
		// Add br
		mat.appendChild(document.createElement("tr"));
	}
	mat.appendChild(document.createTextNode("All eyes this way."));
}
console.log('hey');
function proceed(seatAndShowId) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {

		console.log("proc sc");

		if (xhttp.readyState == 4 && xhttp.status == 200) {
				var blockSeatResp = JSON.parse(xhttp.responseText, function(key,
						value) {
					var type;
					if (value && typeof value === 'object') {
						type = value.type;
						if (typeof type === 'string'
								&& typeof window[type] === 'function') {
							return new (window[type])(value);
						}
					}
					return value;
				});

			console.log(blockSeatResp);
		}
	};

	console.log("pr def done");
	xhttp.open("POST", "getShowTimes", true);
	console.log("opened");
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
	console.log("sent");

}

function seatSelected(seatRC){
	console.log(seatRC);
	
	console.log(seatRc.getElementsByTagName("div")[0]);
	console.log(seatRc.getElementsByTagName("div")[0].getAttribute("id"))
	
	var seatNum = seatRc.getElementsByTagName("div")[0].getAttribute("id");
	console.log(seatNum);
}
jQuery('.btn').click(function(e){
	var el = e.target.id;
	var cl = jQuery('#'+el);
	if(cl.attr('class')==='red'){
		cl.removeClass('red');
	}
	else if(cl.attr('class')===''|| cl.attr('class')==null || typeof cl.attr('class')==='undefined'){
		cl.addClass('red');
	}
});
/*
	in the url  script, set lock to that column of that tabel,
	eg create table(seatno,movie,lock);
	set lock in the script;
	after timer out, again send an ajax request to some different url,
	release lock.
*/
function sendDataToApi(arr){
	var postData = {"response":arr};
	$.ajax({
		url:'http:myserver/setLock',
		type:'POST',
		data: postData,
		success:function(data){
			//handle callback here
			startTimer(3,0,arr);
		},
		error: function(data){
			//error cases here
			console.log('error connecting');
		}
	});
	startTimer(0,5,arr);
};

//Global Variable;
var timerRunning=false;
function startTimer(timeInMinutes,timerInSeconds,arr){
	var min = timeInMinutes;
	var sec = timerInSeconds;
	var arr = arr;
	console.log(arr);
if(timerRunning==false)
{
	var timer = setInterval(updateTime,1000);
	timerRunning= true;
}
function updateTime(){
	if(sec>0){
		sec--;
		$('#sec').html(sec);
	}
	if(min>0 && sec==0){
		 min--;
		$('#min').html(min);
		sec=59;
	}
	if(min==0 && sec==0){
		timerRunning = false;
		clearInterval(timer);
		
		releaseLock(arr);
	}
}
};
function releaseLock(arr){
console.log(arr);
arr.forEach(function(el,index){
	console.log(el);
		$('#'+el).removeClass('green');

	});
	timerRunning = false;
	$.ajax({
		url : '/releaseLock',
		type: 'post',
		data: 'id',
		success : function(){
			arr.forEach(function(el,index){
				$('#'+el.id).removeClass('red');
			});
		},
		error : function(){
			console.log('someerror');
			//error 
		}
	});

	$('#back').trigger('click');

};


$('#proceedPayment').click(function(){
	var seatArray = [];
	$('.btn .red').each(function(index,el){
		seatArray.push(el.id);
		$('#'+el.id).removeClass('red');
		$('#'+el.id).addClass('green');
	});
	//console.log(seatArray);
	$('#seatsMatrix').hide();
	$('#timer').show();
	$('#paymentForm').show();
	sendDataToApi(seatArray);

});
$('#back').click(function(){
	$('#seatsMatrix').show();
	$('#timer').hide();
	$('#paymentForm').hide();
});