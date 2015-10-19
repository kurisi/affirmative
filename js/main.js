$(document).ready(function() {

	// All tag lists are in separate js files that are fetched by index.html

	var patientName = "Anonymous"; // If user doesn't enter name
	var mood;

	var lastImagePoints = 0;
	var imagePoints = 0;

	var chosenImage;

	var chosenImageUrl;
	var chosenImageUsername;
	var chosenImageTags;

	var date;

	var moodTags;
	var moodResult;
	
	$("#diagnostics").hide();
	$("#affirmation").hide();

	$("#diagnosticslink").click(function() {
		$("#splash").hide();
		$("#diagnostics").show();
	});

	$("#submitButton").click(function() {
		
		if ($("input:checked").val() === "sad") {
			mood = "sad";
			moodTags = sadTags;
			moodResult = "encouragement";
		}
		else if ($("input:checked").val() === "unmotivated") {
			mood = "unmotivated";
			moodTags = unmotivatedTags;
			moodResult = "motivation";
		}
		else if ($("input:checked").val() === "failure") {
			mood = "failure";
			moodTags = failureTags;
			moodResult = "self-worth";
		}

		diagnose(mood);
	});

	function diagnose(mood) {
		$("#affirmation").show();
		$("#diagnostics").hide();

		if ($("#patientNameInput").val() != ""){
			patientName = $("#patientNameInput").val();
			$("#patientNameDisplay").html(patientName);
		}

		if (mood != undefined){
			if (mood === "sad") {
				moodTags = sadTags;
				moodResult = "encouragement";
			}
			else if (mood === "unmotivated") {
				moodTags = unmotivatedTags;
				moodResult = "motivation";
			}
			else if (mood === "failure") {
				moodTags = failureTags;
				moodResult = "self-worth";
			}

		}

		// Get images from Instagram

		$.ajax({
		  dataType: "json",
		  url: "https://api.instagram.com/v1/tags/affirmation/media/recent?client_id=a40e2c99a1024d32b638b485b780107e&callback=?&count=100",
		  success: chooseImage
		});
	};

	// Choose best image to display

	function chooseImage(data) {

		// Loop through all images
		for(var i = 0; i<(data.data.length); i++){
	        var username = data.data[i].user.username;
	        var url = data.data[i].images.standard_resolution.url;
	        var tags = data.data[i].tags;

	        imagePoints = 0;

        	processTags(data, i, tags, imagePoints);
        }

        chosenImageUsername = chosenImage.user.username;
    	chosenImageTags = chosenImage.tags;
    	chosenImageUrl = chosenImage.images.standard_resolution.url;
    	chosenImageCreated = chosenImage.created_time;

    	var dateFromNow = moment.unix(chosenImageCreated).fromNow();

	    $('#imageContainer').append("<img src="+chosenImageUrl+"> <div class='imagetext'>Patient <span class='imagetextdata'>" + patientName + "</span><br>Usage <span class='imagetextdata'>Twice daily for " + moodResult + "</span><br>Prescribed by <span class='imagetextdata'><a href=https://instagram.com/"+chosenImageUsername+">"+chosenImageUsername+"</a></span><br>Posted on Instagram <span class='imagetextdata'>" + dateFromNow + "</span></div>");
	};

	function processTags(data, i, tags, imagePoints) {
        $.each(tags, function(j, tagval) {

        	if ($.inArray(tags[j], badTags) >= 0) { // Make sure tag isn't among bad tags
    			imagePoints = 0; // If the tag is a bad one, reset image points and go to next image (exit this loop)
    			return false;
        	}
        	if ($.inArray(tags[j], goodTags) >= 0) { // Check if tag is among good tags
        		imagePoints += 1;
        	}
        	if ($.inArray(tags[j], moodTags) >= 0) { // Check if tag is among mood tags
        		imagePoints += 10;
        	}
        });

        if (imagePoints > lastImagePoints) { // Compare number of good tags to last image
        	chosenImage = data.data[i]; // Pick image with most good tags
        	lastImagePoints = imagePoints;
        };

        return imagePoints;
	};

});
