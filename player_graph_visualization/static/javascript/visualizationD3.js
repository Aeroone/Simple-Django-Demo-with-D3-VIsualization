//Size of region to render on
var width = 1000,
height = 900;
		       
//Add our canvas
var svg = d3.select("body").append("svg")
     		.attr("width", width)
			.attr("height", height);
										
$(document).ready(function(){
    $('#update').click(function(){
       $.ajax({
           url: '/data/',
           type: "GET",
           dataType: 'json',
           success: function (new_dict) {
               
               graph = new_dict;          
		       		       
		       //D3 force directed layout
			   //Try playing with the charge and link distance
			   var radius_distance = d3.scale.sqrt().range([0, 10]);
							
			   var force = d3.layout.force()
					.charge(-500)
					.linkDistance(function(d){return radius_distance(d.source.goals)+radius_distance(d.target.goals)+ 50;})
					.size([width, height]);
							
			   //Set up tooltip
			   var tip = d3.tip()
					.attr('class', 'd3-tip')
				    .offset([-10, 0])
					.html(function (d) {
						return  "Name:"+d.name+", "+"Position:"+d.position+", "+"Appearances:"+d.appearances+"";
					});
			   svg.call(tip);
			   
			   //force the graph		       
		       force
			       .nodes(graph.nodes)
				   .links(graph.links)
				   .start();
												  
			   //Add the links
			   var link = svg.selectAll(".link")
				   .data(graph.links)
				   .enter()
				   .append("line")
				   .attr("class", "link")
				   .style("stroke-width", function(d) { return Math.sqrt(d.value); });
										 
			   //Add the nodes with groups	
			   var gnodes = svg.selectAll("g.gnode")	
				   .data(graph.nodes)
				   .enter()
				   .append('g')
				   .classed('gnode', true)
				   .call(force.drag);
			   
			   var color = d3.scale.category20();	   
			   
			   var node = gnodes.append("circle")
				   .attr("class", "node")
				   .attr("r", function(d){return Math.sqrt(d.goals);})
				   //.attr("r", function(d){return 0.14*d.goals;})
				   .attr("fill", function(d) { return color(d.position); })
				   .style("stroke-width", 0.5)
				   .style("stroke", "yellow")
				   .on('mouseover', tip.show) 
				   .on('mouseout', tip.hide);
											
			   var labels = gnodes.append("text")
				   .text(function(d){
				       if (d.appearances>=250) {
					       return d.name;
					   }
					});
										
			   labels.attr("font-family", "sans-serif")
				   .attr("dx", 15)
				   .attr("dy", 0)
				   .attr("font-size", function (d){ return 2*Math.sqrt(d.goals); })
				   .attr("fill", "purple");
             
	     		//Update stuff for animation:
				//   This takes the physics simulation for the force directed graph and
				//   sets the location of the nodes and edges to the new positions
				force.on("tick", function() {
					link.attr("x1", function(d) { return d.source.x; })
				        .attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });
						
					// Translate the groups
					gnodes.attr("transform", function(d) { 
						return 'translate(' + [d.x, d.y] + ')'; 
					});
				}); 
             }      
         })
     })     
});


					    		    	
			   