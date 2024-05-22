/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import react, { useEffect, useRef } from "react";
import "./graph.css";
import * as d3 from "d3";

export default function Page() {
  const graphRef = useRef();
  const textRef = useRef();
  var width, height;
  useEffect(() => {
    width = graphRef.current.clientWidth;
    height = graphRef.current.clientHeight;
  });
  const buildGraph = () => {
    var svg = d3.select("svg");
    // clear svg
    svg.text("");

    var data = textRef.current.value.split("\n");
    data = data.filter((d) => d.length != 0);
    if (data[0] == "") return;

    var nodes = [];
    for (var i = 0; i < parseInt(data[0]); i++) {
      nodes.push({ id: i });
    }

    var links = [];
    for (var j = 1; j < data.length; j++) {
      var linkData = data[j].split(" ");
      links.push({
        source: parseInt(linkData[0]),
        target: parseInt(linkData[1]),
        value: parseInt(linkData[2]),
      });
    }

    var simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    var nodeGroup = svg.append("g").attr("class", "nodes");

    var node = nodeGroup
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 25)
      .call(drag(simulation));

    var nodeLabel = nodeGroup
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "nodelabel")
      .text(function (d) {
        return d.id;
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      nodeLabel.attr("x", (d) => d.x).attr("y", (d) => d.y + 5);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  };
  return (
    <div className="flex flex-row justify-evenly mt-12 w-full h-full">
      <div className="flex flex-col w-1/4">
        <textarea ref={textRef} className="border h-96 text-2xl"></textarea>
        <button
          className="p-4 bg-slate-600 text-white rounded text-xl"
          onClick={buildGraph}
        >
          Generate
        </button>
      </div>
      <svg className="w-full h-full border" ref={graphRef}></svg>
    </div>
  );
}
