package com.auction.controller;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.xml.bind.JAXBException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.auction.model.Auction;
import com.auction.model.Player;
import com.auction.model.Team;
import com.auction.service.AuctionService;
import com.auction.util.AuctionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.auction.util.AuctionFunctions;

@Controller
public class IndexController 
{
	@Autowired
	AuctionService auctionService;

	public static String expiry_date = "2026-12-31";
	public static String current_date = "";
	public static String error_message = "";
	public static Auction session_auction;
	public static Auction session_current_bid;
	public static String session_selected_broadcaster;
	public static boolean is_this_updating = false;
	List<Team> session_team = new ArrayList<Team>();
	List<Player> session_player = new ArrayList<Player>();
	
	String teamName = "";
	int rtmUsed = 0;
	
	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model) throws JAXBException, IOException, ParseException 
	{
		if(current_date == null || current_date.isEmpty()) {
			current_date = AuctionFunctions.getOnlineCurrentDate();
		}
		
		return "initialise";
	}
	@RequestMapping(value = {"/auction"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String auctionPage(ModelMap model,
			@RequestParam(value = "selectedBroadcaster", required = false, defaultValue = "") String selectedBroadcaster) 
					throws JAXBException, IOException, ParseException 
	{
		if(current_date == null || current_date.isEmpty()) {
			current_date = AuctionFunctions.getOnlineCurrentDate();
		}
		if(current_date == null || current_date.isEmpty()) {
			model.addAttribute("error_message","You must be connected to the internet online");
			return "error";
		} else if(new SimpleDateFormat("yyyy-MM-dd").parse(expiry_date).before(new SimpleDateFormat("yyyy-MM-dd").parse(current_date))) {
			model.addAttribute("error_message","This software has expired");
			return "error";
		}else {
			session_selected_broadcaster = selectedBroadcaster;
			model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
			
			session_current_bid = new Auction();
			session_auction = new Auction();
			
			return "auction";
		}
	}
	
	@RequestMapping(value = {"/processAuctionProcedures.html"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processAuctionProcedures(
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess)
					throws Exception
	{	
		switch (whatToProcess.toUpperCase()) {
		case "READ-MATCH-AND-POPULATE":
		    Auction auctionData = new ObjectMapper().readValue(new File(AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.AUCTION_JSON), Auction.class);
		    Auction currentBidData = new ObjectMapper().readValue(new File(AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.CURRENT_BID_JSON), Auction.class);
		    
		    auctionData = AuctionFunctions.populateMatchVariables(session_auction, session_player, session_team);
		    auctionData.setTeamZoneList(AuctionFunctions.PlayerCountPerTeamZoneWise(auctionData.getTeam(),
		    		auctionData.getPlayers(), auctionData.getPlayersList(),session_selected_broadcaster));
		    teamName = "NO";
		    for(int i=0; i<auctionData.getPlayersList().size()-1; i++) {
		    	if(currentBidData.getCurrentPlayers().getPlayerId() == auctionData.getPlayersList().get(i).getPlayerId()) {
		    		if(auctionData.getPlayersList().get(i).getLastYearTeam() != null) {
		    			for(int j=0; j<=auctionData.getTeam().size()-1; j++) {
		    				  if(auctionData.getTeam().get(j).getTeamId() == auctionData.getPlayersList().get(i).getLastYearTeam()) {
		    					  for(Player auc : auctionData.getPlayers()) {
		    							if(auctionData.getPlayersList().get(i).getLastYearTeam() == auc.getTeamId() && 
		    									auc.getSoldOrUnsold().equalsIgnoreCase(AuctionUtil.RTM)) {
		    								rtmUsed++;
		    							}
		    						}
		    						if((Integer.valueOf(auctionData.getTeam().get(j).getTeamTotalRTM()) - rtmUsed) > 0) {
		    							teamName = auctionData.getTeam().get(j).getTeamName1();
		    							System.out.println(" tm = "+teamName);
		    						}else {
		    						}
		    				  }
		    			  }
		    		}else {
		    		}
		    	}
		    }
		    rtmUsed = 0;
		    
		//    currentBidData.getCurrentPlayers().getLastYearTeam()
		    Map<String, Object> response = new HashMap<>();
		    response.put("auction", auctionData);
		    response.put("currentBid", currentBidData);
		    response.put("rtm", teamName);
		   // response.put("auctionService", currentBidData);
		    return new ObjectMapper().writeValueAsString(response);
		default:
		    return new ObjectMapper().writeValueAsString(session_current_bid);
		}
		
	}
}