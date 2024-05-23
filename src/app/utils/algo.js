import Swal from "sweetalert2";

export const isNum = (...num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

export const FormatGraphData = (data) => {
  var nodes = [];
  var links = [];
  data = data.split("\n");

  data = data.filter((d) => d.length != 0);
  if (data[0] == "") throw "No Data";

  try {
    if (!isNum(data[0])) throw "number of node is not valid!";
    for (var i = 0; i < parseInt(data[0]); i++) {
      nodes.push({ id: i });
    }

    var AlllinkData = data[1].slice(1, -1);
    AlllinkData = [...AlllinkData];
    AlllinkData = AlllinkData.filter((d) => isNum(d));

    for (var j = 0; j < AlllinkData.length; j += 3) {
      var linkData = [AlllinkData[j], AlllinkData[j + 1], AlllinkData[j + 2]];

      if (linkData.some((d) => isNum(d) === false))
        throw "Some link data is not number";

      if (
        parseInt(linkData[0]) >= nodes.length ||
        parseInt(linkData[1]) >= nodes.length
      ) {
        throw "Node ID out of range!";
      }

      links.push({
        source: parseInt(linkData[0]),
        target: parseInt(linkData[1]),
        value: parseInt(linkData[2]),
      });
    }
  } catch (e) {
    Swal.fire({
      title: "Error",
      text: e,
      icon: "error",
    });
  }
  return [nodes, links];
};

// Tree

class Node {
  constructor(node) {
    this.node = node;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  push(node) {
    var newNode = new Node(node);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = this.tail.next;
    }
  }
  pop() {
    if (this.head === null) return;
    else if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }
  }
  front() {
    return this.head;
  }
  empty() {
    return this.head === null;
  }
}

class TreeNode {
  constructor(id, num) {
    this.id = id;
    this.val = num !== "null" ? parseInt(num) : undefined;
    this.left = null;
    this.right = null;
  }
}

const bfs = (data) => {
  var nodes = [];
  var links = [];
  if (data.length == 0 || data[0] === "null") throw "Error input";
  var q = new Queue();
  q.push(new TreeNode(0, data[0]));
  nodes.push({
    id: 0,
    val: parseInt(data[0]),
  });
  var i = 1;
  while (!q.empty()) {
    var nq = new Queue();
    while (!q.empty()) {
      var curNode = q.front().node;

      q.pop();

      if (i < data.length && data[i] !== "null") {
        var id = nodes.length;
        var leftNode = new TreeNode(id, data[i]);
        curNode.left = leftNode;
        nq.push(leftNode);
        nodes.push({
          id: id,
          val: parseInt(data[i]),
        });
        links.push({
          source: curNode.id,
          target: id,
        });
      }
      if (i + 1 < data.length && data[i + 1] !== "null") {
        var id = nodes.length;
        var rightNode = new TreeNode(id, data[i + 1]);
        curNode.right = rightNode;
        nq.push(rightNode);
        nodes.push({
          id: id,
          val: parseInt(data[i + 1]),
        });
        links.push({
          source: curNode.id,
          target: id,
        });
      }
      i += 2;
    }
    q = nq;
  }
  return [nodes, links];
};

export const FormatTreeData = (data) => {
  data = data.slice(1, -1).split(",");
  try {
    const [nodes, links] = bfs(data);
    return [nodes, links];
  } catch (e) {
    Swal.fire({
      title: "Error",
      text: e,
      icon: "error",
    });
    return [];
  }
};
