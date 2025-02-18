document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("dropZone");
    const ctx = canvas.getContext("2d");
  
    let offsetX = 0, offsetY = 0;
    let isDraggingCanvas = false;
    let startX, startY;
  
    canvas.width = document.querySelector(".content").clientWidth - 260; // Đảm bảo canvas nằm bên phải sidebar
    canvas.height = document.querySelector(".content").clientHeight;
  
    let blocks = [];
  
    function drawBlocks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        blocks.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x + offsetX, block.y + offsetY, 50, 50);
        });
    }
  
    function togglePanel() {
        let panel = document.getElementById("panel");
        panel.classList.toggle("open");
    }
  
    document.querySelectorAll(".sidebar .icon").forEach(icon => {
        icon.addEventListener("click", togglePanel);
    });
  
    window.drag = function (event, color) {
        event.dataTransfer.setData("color", color);
    };
  
    window.allowDrop = function (event) {
        event.preventDefault();
    };
  
    window.drop = function (event) {
        event.preventDefault();
        const color = event.dataTransfer.getData("color");
        const x = event.offsetX - offsetX;
        const y = event.offsetY - offsetY;
  
        const newBlock = { x, y, color };
        blocks.push(newBlock);
        drawBlocks();
    };
  
    canvas.addEventListener("mousedown", function (event) {
        if (event.button === 2) return;
  
        const mouseX = event.offsetX - offsetX;
        const mouseY = event.offsetY - offsetY;
        let selectedBlock = null;
  
        blocks.forEach(block => {
            if (
                mouseX > block.x &&
                mouseX < block.x + 50 &&
                mouseY > block.y &&
                mouseY < block.y + 50
            ) {
                selectedBlock = block;
            }
        });
  
        if (selectedBlock) {
            function onMouseMove(event) {
                selectedBlock.x = event.offsetX - 25 - offsetX;
                selectedBlock.y = event.offsetY - 25 - offsetY;
                drawBlocks();
                checkSnap(selectedBlock);
            }
  
            function onMouseUp() {
                canvas.removeEventListener("mousemove", onMouseMove);
                canvas.removeEventListener("mouseup", onMouseUp);
            }
  
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);
        } else {
            isDraggingCanvas = true;
            startX = event.clientX;
            startY = event.clientY;
        }
    });
  
    canvas.addEventListener("mousemove", function (event) {
        if (isDraggingCanvas) {
            let dx = event.clientX - startX;
            let dy = event.clientY - startY;
  
            offsetX += dx;
            offsetY += dy;
  
            startX = event.clientX;
            startY = event.clientY;
  
            drawBlocks();
        }
    });
  
    canvas.addEventListener("mouseup", function () {
        isDraggingCanvas = false;
    });
  
    function checkSnap(block) {
        let threshold = 10;
        let closestBlock = null;
        let minDist = Infinity;
  
        blocks.forEach(otherBlock => {
            if (otherBlock !== block) {
                let dx = Math.abs(block.x - otherBlock.x);
                let dy = block.y - (otherBlock.y + 50);
  
                if (dx < threshold && dy > 0 && dy < minDist) {
                    closestBlock = otherBlock;
                    minDist = dy;
                }
            }
        });
  
        if (closestBlock) {
            block.x = closestBlock.x;
            block.y = closestBlock.y + 50;
            drawBlocks();
        }
    }
  
    canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
  });
  