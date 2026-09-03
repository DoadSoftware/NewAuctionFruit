<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auction Dashboard</title>

	<script src="<c:url value='/webjars/jquery/3.7.1/jquery.min.js'/>"></script>
	<script src="<c:url value='/webjars/bootstrap/5.3.8/js/bootstrap.bundle.min.js'/>"></script>
	<script src="<c:url value='/resources/javascript/index.js'/>"></script>
	
	<link rel="stylesheet" href="<c:url value='/webjars/bootstrap/5.3.8/css/bootstrap.min.css'/>"/>

  <style>
    /* General Body Styling */
    body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        background: #9EB2EB;
        color: white;
        min-height: 100vh;
        overflow-x: hidden;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
   
  	#auction_div {
	    display: flex;             
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;       
	    background: #13265C;
	    backdrop-filter: blur(10px);
	    border: 3px solid rgba(255, 255, 255, 0.2);
	    border-radius: 20px;
	    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
	    padding: 40px;
	    width: 80%;
	    max-width: 2000px;
	    height: auto;
	    text-align: center;
	    animation: fadeIn 1.5s ease-in-out;
	}
	
	#custom-div {
	    display: grid;
	    grid-template-columns: 1fr 1fr;  
	    grid-auto-rows: auto;
	    width: 100%;
	}
	
	#custom-div h2 {
	    grid-column: 1 / -1;
	}
	
	#custom-div h1 {
	    grid-column: 1 / -1;
	}
	
	#auction_div h1 {
	    font-size: 130px;
	    font-weight: bold;
	    color: #ffcc00; 
	    margin-bottom: 20px;
	    text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.7);
	}
	
	#auction_div h2 {
	    font-size: 60px;
	    font-weight: 500;
	    color: #ffffff;
	    margin-bottom: 40px;
	    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
	}
	
	#auction_div h3 {
	    font-size: 130px;
	    font-weight: 500;
	    color: #ffffff;
	    margin-bottom: 30px;
	    text-align: center;
	    font-weight: bold;
	    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
	}
	
	#auction_div h4 {
	    font-size: 110px;
	    font-weight: 500;
	    color: #ffffff;
	    margin-bottom: 40px;
	    text-align: right;
	    font-weight: bold;
	    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
	}
	 
    .form-group button {
        background: linear-gradient(90deg, #ff8c00, #ffa500);
        color: #fff;
        font-size: 1.8rem;
        font-weight: bold;
        padding: 15px 50px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .form-group button:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
        #auction_div h1 {
            font-size: 200px;
        }
        #auction_div h2 {
            font-size: 100px;
        }
    }

    @media (max-width: 768px) {
        #auction_div h1 {
            font-size: 150px;
        }
        #auction_div h2 {
            font-size: 80px;
        }

        .form-group button {
            font-size: 1.5rem;
            padding: 12px 40px;
        }
    }

    /* Animation */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
  </style>

  <!-- Custom JavaScript -->
  <script type="text/javascript">
    setInterval(() => {
        processAuctionProcedures('READ-MATCH-AND-POPULATE');
    }, 800);

    function afterPageLoad(context) {
        console.log('Page loaded for context:', context);
    }
  </script>
</head>
<body onload="afterPageLoad('AUCTION');">
  <form:form name="auction_form" autocomplete="off" action="auction" method="POST" enctype="multipart/form-data">
    <div class="content">
      <div id="auction_div">
        <h1>Auction</h1>
        <h2 class="highlight">Current Bid: ₹50,000</h2>
        <div class="form-group">
          <button type="button">Place Your Bid</button>
        </div>
      </div>
    </div>
    <input type="hidden" name="selectedBroadcaster" id="selectedBroadcaster" value="${session_selected_broadcaster}"/>
  </form:form>
</body>
</html>
