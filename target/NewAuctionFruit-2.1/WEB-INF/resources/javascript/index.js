var soldForPoints;
var session_auction; 
var auctionData = null; 
var currentBid = null; 
var currentPlayer = null;  
var TeamName;

function secondsTimeSpanToHMS(s) {
  var h = Math.floor(s / 3600); //Get whole hours
  s -= h * 3600;
  var m = Math.floor(s / 60); //Get remaining minutes
  s -= m * 60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
} 
function processMatchTime() {
	if(clock_data) {
		if(clock_data.matchTimeStatus.toLowerCase() == 'start') {
			clock_data.matchTotalSeconds = clock_data.matchTotalSeconds + 1;
			processAuctionProcedures('LOG_TIME',clock_data.matchTotalSeconds);
		}
		if(document.getElementById('match_time_hdr')) {
			document.getElementById('match_time_hdr').innerHTML = 'MATCH TIME : ' + 
				secondsTimeSpanToHMS(clock_data.matchTotalSeconds);
		}
	}
}
function processWaitingButtonSpinner(whatToProcess) 
{
	switch (whatToProcess) {
	case 'START_WAIT_TIMER': 
		$('.spinner-border').show();
		$(':button').prop('disabled', true);
		break;	case 'END_WAIT_TIMER': 
		$('.spinner-border').hide();
		$(':button').prop('disabled', false);
		break;
	}
}
function afterPageLoad(whichPageHasLoaded)
{
	switch (whichPageHasLoaded) {
	case 'AUCTION':
		processAuctionProcedures('LOAD_MATCH',null);
		break;
	}
}
function initialiseForm(whatToProcess, dataToProcess)
{
	switch (whatToProcess) {
	case 'TIME':
	
		break;
	case 'MATCH':
	
		break;
	}
}
function uploadFormDataToSessionObjects(whatToProcess)
{
	var formData = new FormData();
	var url_path;

	$('input, select, textarea').each(
		function(index){  
			if($(this).is("select")) {
				formData.append($(this).attr('id'),$('#' + $(this).attr('id') + ' option:selected').val());  
			} else {
				formData.append($(this).attr('id'),$(this).val());  
			}	
		}
	);
	
	url_path = 'upload_match_setup_data';
	
	$.ajax({    
		headers: {'X-CSRF-TOKEN': $('meta[name="_csrf"]').attr('content')},
        url : url_path,     
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',     
        success : function(data) {

        },    
        error : function(e) {    
       	 	console.log('Error occured in uploadFormDataToSessionObjects with error description = ' + e);     
        }    
    });		
	
}
function processUserSelection(whichInput)
{	
	switch ($(whichInput).attr('name')) {
	case 'load_scene_btn':
	  	document.initialise_form.submit();
		break;
	case 'selectedBroadcaster':
		switch ($('#selectedBroadcaster :selected').val()) {
		case 'HANDBALL':
			//$('#vizPortNumber').attr('value','1980');
			//$('label[for=vizScene], input#vizScene').hide();
			//$('label[for=which_scene], select#which_scene').hide();
			//$('label[for=which_layer], select#which_layer').hide();
			break;
		}
		break;
	case 'cancel_btn': 
		document.getElementById('select_event_div').style.display = 'none';
		processWaitingButtonSpinner('END_WAIT_TIMER');
		break;
	case 'player_overwrite_btn':
		processWaitingButtonSpinner('START_WAIT_TIMER');
		processAuctionProcedures('PLAYER_OVERWRITE',null);
		break;
	case 'refresh_player':
		processWaitingButtonSpinner('START_WAIT_TIMER');
		processAuctionProcedures('REFRESH_PLAYER',null);
		break;
	case 'player_overwrite':
		addItemsToList('LOAD_PLAYER_OVERWRITE',session_auction);
		document.getElementById('select_event_div').style.display = '';
		break;
	default:
		switch ($(whichInput).attr('id')) {
		case 'increment_btn':
			processAuctionProcedures('INCREMENT_BID',null);
			break;
		case 'decrement_btn':
			processAuctionProcedures('DECREMENT_BID',null);
			break;
		}
		break;
	}
	
}
function processAuctionProcedures(whatToProcess, whichInput)
{
	var value_to_process; 

	$.ajax({    
        type : 'Get',     
        url : 'processAuctionProcedures.html',     
        data : 'whatToProcess=' + whatToProcess + '&valueToProcess=' + value_to_process, 
        dataType : 'json',
        success : function(data) {
			session_auction = data;
		    auctionData = data.auction;
		    currentBidData = data.currentBid;
		    TeamName = data.rtm;
		    currentPlayer = currentBidData ? currentBidData.currentPlayers : null;
        	switch(whatToProcess) {
			case 'LOAD_MATCH':
				addItemsToList('LOAD_MATCH',data);
				document.getElementById('auction_div').style.display = '';
				document.getElementById('select_event_div').style.display = 'none';
				break;
			case 'INCREMENT_BID': case 'DECREMENT_BID': case 'REFRESH_PLAYER':
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'UNDO_PLAYERS':
				alert('Removed Successfully');
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'PLAYER_OVERWRITE':
				addItemsToList('LOAD_PLAYER_OVERWRITE',data);
				addItemsToList('LOAD_MATCH',data);
				break;
			case 'READ-MATCH-AND-POPULATE':
				addItemsToList('SHOW_BID',data);
				break;
        	}
    		processWaitingButtonSpinner('END_WAIT_TIMER');
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
}
function addItemsToList(whatToProcess, dataToProcess)
{	
	switch (whatToProcess) {
	
	case 'SHOW_BID':
		$('#auction_div').empty();
		if (!currentPlayer) return;
		let divElement = $('<div>').attr('id', 'custom-div').css({
		    'display': 'grid',
		    'grid-template-columns': '1fr 1fr',
		});
		let currentAmount = currentPlayer.soldForPoints;
		let currentDisplay = formatToLakh(currentAmount);
		
		let playerInfo = $('<h2>').html(
		    `<span style="font-size: 60px; font-weight: 900; color: rgb(255,153,51);">
		        ${currentPlayer.playerNumber}
		     </span><br>${currentPlayer.full_name}`
		).css({'grid-column': '1 / -1'});
		
		let currentBid = $('<h1>').html(
		    `<span style="font-size: 60px;">CURRENT BID: </span>
		     <span style="font-size: 150px;">${currentDisplay}</span>`
		).css({'grid-column': '1 / -1'});
		
		let increment = (currentAmount < 500000) ? 25000 : 50000;
		let nextBidDisplay = formatToLakh(currentAmount + increment);
		
		let nextBid = $('<div>').html(
		    `<span style="font-size: 50px; color:#fff;">NEXT BID:</span><br>
		     <span style="font-size: 120px;">${nextBidDisplay}</span>`
		).css({
		    'text-align': 'left',
		    'padding-left': '40px'
		});
		
		let rtmDiv = $('<div>').html(
		            `<span style="font-size: 40px;">RTM: </span><br>
		             <span style="font-size: 60px;">${TeamName}</span>`
		        ).css({
		    'text-align': 'right',
		    'padding-right': '40px',
		    'color': '#00ffcc'
		});
		divElement.append(playerInfo, currentBid, nextBid, rtmDiv);
		$('#auction_div').append(divElement);
		
		break;
	/*case 'SHOW_BID':
		$('#auction_div').empty();

        if (dataToProcess) {
			let divElement = $('<div>').attr('id', 'custom-div');
			
            let currentAmount = dataToProcess.currentPlayers.soldForPoints;
			let displayAmount = (currentAmount / 100000).toFixed(2); 

			let h2Element = $('<h2>').html(
				'<span style="font-weight: 900; color: rgb(255,153,51);">' + 
				dataToProcess.currentPlayers.playerNumber + 
				'</span> <br>' + dataToProcess.currentPlayers.full_name);

			let h1Element = $('<h1>').html(
			`<span style="font-size: 70px; font-weight: 800;">CURRENT BID: </span>
			<span style="font-size: 200px;">&#8377;${(dataToProcess.currentPlayers.soldForPoints / 100000).toFixed(2)}K</span>`
			);

			let nextBidIncrement = 0;

			if (currentAmount >= 300000 && currentAmount < 500000) {
				nextBidIncrement = 20000;
			} else if (currentAmount >= 500000 && currentAmount < 700000) {
				nextBidIncrement = 25000;
			} else if (currentAmount >= 700000) {
				nextBidIncrement = 50000;
			}

			let nextBidAmount = currentAmount + nextBidIncrement;
			let nextBidDisplay = (nextBidAmount / 100000).toFixed(2);
			let h3Element = $('<h3>').html(`NEXT BID <br> &#8377;  ${nextBidDisplay}K`);

            divElement.append(h2Element, h1Element, h3Element);
            $('#auction_div').append(divElement);
        }
		break;*/		
	}
}

function removeSelectDuplicates(select_id)
{
	var this_list = {};
	$("select[id='" + select_id + "'] > option").each(function () {
	    if(this_list[this.text]) {
	        $(this).remove();
	    } else {
	        this_list[this.text] = this.value;
	    }
	});
}
function checkEmpty(inputBox,textToShow) {

	var name = $(inputBox).attr('id');
	
	document.getElementById(name + '-validation').innerHTML = '';
	document.getElementById(name + '-validation').style.display = 'none';
	$(inputBox).css('border','');
	if(document.getElementById(name).value.trim() == '') {
		$(inputBox).css('border','#E11E26 2px solid');
		document.getElementById(name + '-validation').innerHTML = textToShow + ' required';
		document.getElementById(name + '-validation').style.display = '';
		document.getElementById(name).focus({preventScroll:false});
		return false;
	}
	return true;	
}	

function formatToLakh(amount) {
    let value = amount / 100000; // convert to lakh
    return (value % 1 === 0) ? value + 'L' : value.toFixed(2) + 'L';
}
