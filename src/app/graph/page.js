/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import react, { useEffect, useRef } from "react";
import "../utils/graph.css";
import * as d3 from "d3";
import { Add, FormatGraphData } from "../utils/algo";

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

    const [nodes, links] = FormatGraphData(textRef.current.value);

    var DirectedGraph = document.getElementById("directed");
    if (DirectedGraph.checked) {
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 23)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "black");
    }

    var simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(250)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    var linkGroup = svg.append("g").attr("class", "links");
    var link = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("marker-end", "url(#arrowhead)");

    var linkLabel = linkGroup
      .selectAll("text")
      .data(links)
      .enter()
      .append("text")
      .attr("class", "linklabel")
      .text((d) => d.value);

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

    const checkX = (x) => {
      if (x > width) return width;
      else if (x < 0) return 0;
      else return x;
    };
    const checkY = (x) => {
      if (x > height) return height;
      else if (x < 0) return 0;
      else return x;
    };

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      linkLabel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      node.attr("cx", (d) => checkX(d.x)).attr("cy", (d) => checkY(d.y));
      nodeLabel.attr("x", (d) => checkX(d.x)).attr("y", (d) => checkY(d.y + 5));
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
    <div className="flex flex-row justify-evenly mt-12 w-full h-full gap-2">
      <div className="flex flex-col w-1/4 relative">
        <textarea
          ref={textRef}
          placeholder={"3\n[[0,1,3],[2,1,4]]"}
          className="border h-96 text-2xl outline-none focus:[#placeholder]"
        ></textarea>
        <button
          className="p-4 bg-slate-600 text-white rounded text-xl"
          onClick={buildGraph}
        >
          Generate
        </button>

        <div class="flex justify-center checkbox-wrapper-14 mt-6">
          <input id="directed" type="checkbox" class="switch" />
          <label for="directed">Directed Graph</label>
        </div>
      </div>
      <svg className="w-full h-full border" ref={graphRef}></svg>
    </div>
  );
}
