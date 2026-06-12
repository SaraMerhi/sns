const editorPage = document.querySelector(".editor-page");
if (!editorPage) {
    // Not on an editor page, but let's define variables to avoid errors if other scripts use them
    var isViewOnly = false;
} else {
    var roomType = editorPage.getAttribute("data-room");
    var isViewOnly = editorPage.getAttribute("data-view-only") === "true";
}

const furnitureList = document.querySelector("#furnitureList");
const roomBox = document.querySelector("#roomBox");
const clearBtn = document.querySelector("#clearBtn");
const saveBtn = document.querySelector("#saveBtn");

const topWall = document.querySelector("#topWall");
const leftWall = document.querySelector("#leftWall");
const rightWall = document.querySelector("#rightWall");
const bottomWall = document.querySelector("#bottomWall");
const floorArea = document.querySelector("#floorArea");

const topWallColor = document.querySelector("#topWallColor");
const leftWallColor = document.querySelector("#leftWallColor");
const rightWallColor = document.querySelector("#rightWallColor");
const bottomWallColor = document.querySelector("#bottomWallColor");
const floorColor = document.querySelector("#floorColor");
const roomTitleInput = document.querySelector("#roomTitleInput");

const furnitureByRoom = {
    "bedroom": {
        "Bed": [
            "/static/images/bedroom/bed1.png",
            "/static/images/bedroom/bed3.png",
            "/static/images/bedroom/bed4.png",
            "/static/images/bedroom/bed5.png",
            "/static/images/bedroom/bed6.png",
            "/static/images/bedroom/bed7.png",
            "/static/images/bedroom/bed8.png",
            "/static/images/bedroom/bed9.png",
            "/static/images/bedroom/bed10.png"
        ],
        "Bedside Table": [
            "/static/images/bedroom/bedside_table1.png",
            "/static/images/bedroom/bedside_table2.png",
            "/static/images/bedroom/bedside_table3.png",
            "/static/images/bedroom/bedside_table4.png",
            "/static/images/bedroom/bedside_table5.png"
        ],
        "Closet": [
            "/static/images/bedroom/closet1.png",
            "/static/images/bedroom/closet2.png",
            "/static/images/bedroom/closet3.png",
            "/static/images/bedroom/closet4.png",
            "/static/images/bedroom/closet5.png"
        ],
        "TV": ["/static/images/livingroom/TV5.png"],
        "Pouf": [
            "/static/images/bedroom/pouf1.png",
            "/static/images/bedroom/pouf2.png",
            "/static/images/bedroom/pouf3.png",
            "/static/images/bedroom/pouf4.png",
            "/static/images/bedroom/pouf5.png"
        ],
        "Rug": [
            "/static/images/livingroom/Rag1.png",
            "/static/images/livingroom/Rag2.png",
            "/static/images/livingroom/Rag3.png",
            "/static/images/livingroom/Rag4.png",
            "/static/images/livingroom/Rag5.png",
            "/static/images/livingroom/Rag6.png",
            "/static/images/livingroom/Rag8.png",
            "/static/images/livingroom/Rag9.png",
            "/static/images/livingroom/Rag10.png"
        ],
        "Desk": [
            "/static/images/bedroom/desk1.png",
            "/static/images/bedroom/desk2.png",
            "/static/images/bedroom/desk3.png",
            "/static/images/bedroom/desk4.png",
            "/static/images/bedroom/desk5.png"
        ],
        "Plant": [
            "/static/images/livingroom/plant1.png",
            "/static/images/livingroom/plant2.png",
            "/static/images/livingroom/plant3.png",
            "/static/images/livingroom/plant4.png",
            "/static/images/livingroom/plant5.png"
        ],
        "Lamp": [
            "/static/images/livingroom/lamp1.png",
            "/static/images/livingroom/lamp2.png",
            "/static/images/livingroom/lamp4.png",
            "/static/images/livingroom/lamp5-removebg-preview.png"
        ]
    },
    "living-room": {
        "Arm Chair": [
            "/static/images/livingroom/Armchair1-.png",
            "/static/images/livingroom/Armchair2.png",
            "/static/images/livingroom/Armchair3.png",
            "/static/images/livingroom/Armchair4.png",
            "/static/images/livingroom/Armchair5.png"
        ],
        "Lamp": [
            "/static/images/livingroom/lamp1.png",
            "/static/images/livingroom/lamp2.png",
            "/static/images/livingroom/lamp4.png",
            "/static/images/livingroom/lamp5-removebg-preview.png"
        ],
        "Plant": [
            "/static/images/livingroom/plant1.png",
            "/static/images/livingroom/plant2.png",
            "/static/images/livingroom/plant3.png",
            "/static/images/livingroom/plant4.png",
            "/static/images/livingroom/plant5.png"
        ],
        "Rug": [
            "/static/images/livingroom/Rag1.png",
            "/static/images/livingroom/Rag2.png",
            "/static/images/livingroom/Rag3.png",
            "/static/images/livingroom/Rag4.png",
            "/static/images/livingroom/Rag5.png",
            "/static/images/livingroom/Rag6.png",
            "/static/images/livingroom/Rag8.png",
            "/static/images/livingroom/Rag9.png",
            "/static/images/livingroom/Rag10.png"
        ],
        "Sofa": [
            "/static/images/livingroom/sofa1.png",
            "/static/images/livingroom/sofa2.png",
            "/static/images/livingroom/sofa3.png",
            "/static/images/livingroom/sofa4.png",
            "/static/images/livingroom/sofa5.png"
        ],
        "Table": [
            "/static/images/livingroom/table1.png",
            "/static/images/livingroom/table2.png",
            "/static/images/livingroom/table3.png",
            "/static/images/livingroom/table4.png",
            "/static/images/livingroom/table5.png"
        ],
        "TV": ["/static/images/livingroom/TV5.png"],
        "TV Table": [
            "/static/images/livingroom/TV_table1.png",
            "/static/images/livingroom/TV_table2.png",
            "/static/images/livingroom/TV_table3.png",
            "/static/images/livingroom/TV_table4.png",
            "/static/images/livingroom/TV_table5.png"
        ]
    },
    "bathroom": {
        "Bath": [
            "/static/images/bathroom/bath/bath.png",
            "/static/images/bathroom/bath/bath-1.png",
            "/static/images/bathroom/bath/bath-2.png",
            "/static/images/bathroom/bath/bath-3.png"
        ],
        "Shower": [
            "/static/images/bathroom/shower/shower.png",
            "/static/images/bathroom/shower/shower-1.png",
            "/static/images/bathroom/shower/shower-2.png",
            "/static/images/bathroom/shower/shower-3.png"
        ],
        "Toilet": [
            "/static/images/bathroom/toilet/toilet.png",
            "/static/images/bathroom/toilet/toilet-1.png",
            "/static/images/bathroom/toilet/toilet-2.png",
            "/static/images/bathroom/toilet/toilet-3.png"
        ],
        "Sink": [
            "/static/images/bathroom/sink/sink.png",
            "/static/images/bathroom/sink/sink-1.png",
            "/static/images/bathroom/sink/sink-2.png",
            "/static/images/bathroom/sink/sink-3.png"
        ],
        "Rug": [
            "/static/images/livingroom/Rag1.png",
            "/static/images/livingroom/Rag2.png",
            "/static/images/livingroom/Rag3.png",
            "/static/images/livingroom/Rag4.png",
            "/static/images/livingroom/Rag5.png",
            "/static/images/livingroom/Rag6.png",
            "/static/images/livingroom/Rag8.png",
            "/static/images/livingroom/Rag9.png"
        ],
        "Plant": [
            "/static/images/livingroom/plant1.png",
            "/static/images/livingroom/plant2.png",
            "/static/images/livingroom/plant3.png",
            "/static/images/livingroom/plant4.png",
            "/static/images/livingroom/plant5.png"
        ],
        "Closet": [
            "/static/images/bedroom/closet1.png",
            "/static/images/bedroom/closet2.png",
            "/static/images/bedroom/closet3.png",
            "/static/images/bedroom/closet4.png",
            "/static/images/bedroom/closet5.png"
        ]
    },
    "kitchen": {
        "Table": [
            "/static/images/kitchen/table/table.png",
            "/static/images/kitchen/table/table-1.png",
            "/static/images/kitchen/table/table-2.png",
            "/static/images/kitchen/table/table-3.png",
            "/static/images/kitchen/table/table-4.png"
        ],
        "Stove": [
            "/static/images/kitchen/stove/stove.png",
            "/static/images/kitchen/stove/stove-1.png",
            "/static/images/kitchen/stove/stove-2.png",
            "/static/images/kitchen/stove/stove-3.png",
            "/static/images/kitchen/stove/stove-4.png"
        ],
        "Fridge": [
            "/static/images/kitchen/fridge/fridge.png",
            "/static/images/kitchen/fridge/fridge-1.png",
            "/static/images/kitchen/fridge/fridge-2.png"
        ],
        "Sink": [
            "/static/images/kitchen/sink/sink.png",
            "/static/images/kitchen/sink/sink-1.png",
            "/static/images/kitchen/sink/sink-2.png",
            "/static/images/kitchen/sink/sink-3.png",
            "/static/images/kitchen/sink/sink-4.png"
        ],
        "Plant": [
            "/static/images/livingroom/plant1.png",
            "/static/images/livingroom/plant2.png",
            "/static/images/livingroom/plant3.png"
        ],
        "Lamp": [
            "/static/images/livingroom/lamp1.png",
            "/static/images/livingroom/lamp2.png",
            "/static/images/livingroom/lamp4.png",
            "/static/images/livingroom/lamp5-removebg-preview.png"
        ],
        "Rug": [
            "/static/images/livingroom/Rag1.png",
            "/static/images/livingroom/Rag2.png",
            "/static/images/livingroom/Rag3.png",
            "/static/images/livingroom/Rag4.png",
            "/static/images/livingroom/Rag5.png",
            "/static/images/livingroom/Rag6.png",
            "/static/images/livingroom/Rag8.png",
            "/static/images/livingroom/Rag9.png"
        ]
    }
};

const categoryIcons = {
    "Bed": "/static/images/categoryIcons/bed.png",
    "Bedside Table": "/static/images/categoryIcons/bedsideTable.png",
    "Closet": "/static/images/categoryIcons/closet.png",
    "Arm Chair": "/static/images/categoryIcons/arm-chair.png",
    "Lamp": "/static/images/categoryIcons/lamp.png",
    "Plant": "/static/images/categoryIcons/plant.png",
    "Rug": "/static/images/categoryIcons/rug.png",
    "Sofa": "/static/images/categoryIcons/sofa.png",
    "Table": "/static/images/categoryIcons/table.png",
    "TV Table": "/static/images/categoryIcons/tv-table.png",
    "TV": "/static/images/categoryIcons/tv.png",
    "Desk": "/static/images/categoryIcons/desk.png",
    "Pouf": "/static/images/categoryIcons/pouf.png",
    "Bath": "/static/images/categoryIcons/bath.png",
    "Shower": "/static/images/categoryIcons/shower.png",
    "Toilet": "/static/images/categoryIcons/toilet.png",
    "Sink": "/static/images/categoryIcons/sink.png",
    "Stove": "/static/images/categoryIcons/stove.png",
    "Fridge": "/static/images/categoryIcons/fridge.png"
};

function loadFurnitureCategories() {
    if (!furnitureList) return;
    furnitureList.innerHTML = "";
    const categories = furnitureByRoom[roomType];
    if (!categories) return;

    for (const categoryName in categories) {
        const item = document.createElement("div");
        item.classList.add("furniture-item");

        const iconValue = categoryIcons[categoryName];
        const iconHtml = iconValue && (typeof iconValue === "string") && iconValue.match(/\.(png|jpg|jpeg|svg|gif)$/i)
            ? `<img src="${iconValue}" alt="${categoryName}" class="category-icon-img">`
            : iconValue || "";

        item.innerHTML = `
            <span class="furniture-icon">${iconHtml}</span>
            <span class="furniture-name">${categoryName}</span>
        `;

        item.addEventListener("click", function () {
            showFurnitureOptions(categoryName);
        });

        furnitureList.appendChild(item);
    }
}

function showFurnitureOptions(categoryName) {
    if (!furnitureList) return;
    furnitureList.innerHTML = "";

    const backButton = document.createElement("button");
    backButton.classList.add("back-category-btn");
    backButton.textContent = "← Back";
    backButton.addEventListener("click", loadFurnitureCategories);
    furnitureList.appendChild(backButton);

    const title = document.createElement("h3");
    title.classList.add("options-title");
    title.textContent = categoryName + " Options";
    furnitureList.appendChild(title);

    const options = furnitureByRoom[roomType][categoryName];
    if (!options || options.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("no-options");
        empty.textContent = "No images added yet.";
        furnitureList.appendChild(empty);
        return;
    }

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("div");
        option.classList.add("furniture-option");
        option.innerHTML = `<img src="${options[i]}" alt="${categoryName}">`;
        option.addEventListener("click", function () {
            addFurnitureToRoom(options[i], categoryName);
        });
        furnitureList.appendChild(option);
    }
}

function addFurnitureToRoom(imagePath, furnitureName, savedData = null) {
    if (!roomBox) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("placed-item-wrapper");

    wrapper.style.left = savedData ? savedData.left : "250px";
    wrapper.style.top = savedData ? savedData.top : "200px";
    wrapper.style.width = savedData ? savedData.width : "90px";
    wrapper.style.height = savedData ? savedData.height : "90px";

    const controls = document.createElement("div");
    controls.classList.add("furniture-controls");

    const placedItem = document.createElement("img");
    placedItem.classList.add("placed-item");
    placedItem.src = imagePath;
    placedItem.alt = furnitureName;

    let rotation = savedData ? savedData.rotationValue : 0;
    placedItem.style.transform = "rotate(" + rotation + "deg)";

    controls.innerHTML = `
        <button class="control-btn rotate-left">↺</button>
        <button class="control-btn rotate-right">↻</button>
        <button class="control-btn bigger">＋</button>
        <button class="control-btn smaller">－</button>
        <button class="control-btn delete-item">✕</button>
    `;

    controls.querySelector(".rotate-left").addEventListener("click", function (event) {
        event.stopPropagation();
        rotation -= 90;
        placedItem.style.transform = "rotate(" + rotation + "deg)";
    });

    controls.querySelector(".rotate-right").addEventListener("click", function (event) {
        event.stopPropagation();
        rotation += 90;
        placedItem.style.transform = "rotate(" + rotation + "deg)";
    });

    controls.querySelector(".bigger").addEventListener("click", function (event) {
        event.stopPropagation();
        const newSize = wrapper.offsetWidth + 20;
        wrapper.style.width = newSize + "px";
        wrapper.style.height = newSize + "px";
    });

    controls.querySelector(".smaller").addEventListener("click", function (event) {
        event.stopPropagation();
        if (wrapper.offsetWidth > 60) {
            const newSize = wrapper.offsetWidth - 20;
            wrapper.style.width = newSize + "px";
            wrapper.style.height = newSize + "px";
        }
    });

    controls.querySelector(".delete-item").addEventListener("click", function (event) {
        event.stopPropagation();
        wrapper.remove();
    });

    if (isViewOnly) {
        controls.style.display = "none";
    }

    wrapper.appendChild(controls);
    wrapper.appendChild(placedItem);
    roomBox.appendChild(wrapper);

    if (!isViewOnly) {
        wrapper.addEventListener("click", function (event) {
            event.stopPropagation();
            showControls(wrapper);
        });
        makeMovable(wrapper);
    }
}

function makeMovable(item) {
    let moving = false;
    let offsetX = 0;
    let offsetY = 0;
    const gridSize = 20;

    item.addEventListener("mousedown", function (event) {
        if (event.target.classList.contains("control-btn")) return;
        moving = true;
        item.style.opacity = "0.7";
        const itemRect = item.getBoundingClientRect();
        offsetX = event.clientX - itemRect.left;
        offsetY = event.clientY - itemRect.top;
    });

    document.addEventListener("mousemove", function (event) {
        if (!moving) return;
        const roomRect = roomBox.getBoundingClientRect();
        let x = event.clientX - roomRect.left - offsetX;
        let y = event.clientY - roomRect.top - offsetY;

        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > roomBox.offsetWidth - item.offsetWidth) {
            x = Math.floor((roomBox.offsetWidth - item.offsetWidth) / gridSize) * gridSize;
        }
        if (y > roomBox.offsetHeight - item.offsetHeight) {
            y = Math.floor((roomBox.offsetHeight - item.offsetHeight) / gridSize) * gridSize;
        }

        item.style.left = x + "px";
        item.style.top = y + "px";
    });

    document.addEventListener("mouseup", function () {
        moving = false;
        item.style.opacity = "1";
    });

    item.addEventListener("dblclick", function () {
        item.remove();
    });
}

function showControls(selectedWrapper) {
    document.querySelectorAll(".placed-item-wrapper").forEach(w => w.classList.remove("active"));
    selectedWrapper.classList.add("active");
}

function collectRoomData() {
    const furniture = [];
    document.querySelectorAll(".placed-item-wrapper").forEach(item => {
        const img = item.querySelector(".placed-item");
        const transform = img.style.transform || "rotate(0deg)";
        const rotationValue = parseInt(transform.replace("rotate(", "").replace("deg)", ""));
        furniture.push({
            image: img.getAttribute("src"),
            name: img.getAttribute("alt"),
            left: item.style.left,
            top: item.style.top,
            width: item.style.width,
            height: item.style.height,
            rotationValue: isNaN(rotationValue) ? 0 : rotationValue
        });
    });

    return {
        furniture: furniture,
        colors: {
            topWall: topWallColor ? topWallColor.value : "#e8dfd2",
            leftWall: leftWallColor ? leftWallColor.value : "#d8cec0",
            rightWall: rightWallColor ? rightWallColor.value : "#d8cec0",
            bottomWall: bottomWallColor ? bottomWallColor.value : "#2b2b2b",
            floor: floorColor ? floorColor.value : "#c7a77c"
        }
    };
}

function saveRoomToDatabase() {
    const roomData = collectRoomData();
    const roomTitle = roomTitleInput ? (roomTitleInput.value.trim() || "Untitled Room") : "Untitled Room";

    const payload = {
        room_id: typeof roomId !== 'undefined' ? roomId : 0,
        room_data: roomData,
        room_title: roomTitle
    };

    if (payload.room_id === 0) payload.room_name = roomType;

    fetch("/save-room-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            if (data.room_id) roomId = data.room_id;
            if (typeof showToast === 'function') showToast("Room saved successfully!", "success");
            setTimeout(() => { window.location.href = "/room-complete/" + roomId; }, 1000);
        } else {
            if (typeof showToast === 'function') showToast(data.message, "error");
        }
    });
}

if (roomTitleInput) {
    roomTitleInput.addEventListener("input", function () {
        const newTitle = roomTitleInput.value.trim() || "Untitled Room";
        const heading = document.querySelector(".editor-top h1");
        if (heading) heading.textContent = "Create Your Own " + newTitle;
        document.title = "Create " + newTitle + " | SNS Roomify";
    });
}

function loadSavedRoom() {
    if (typeof roomId === 'undefined' || roomId === 0) return;

    const endpoint = isViewOnly ? "/get-room-data-admin/" : "/get-room-data/";

    fetch(endpoint + roomId)
    .then(r => r.json())
    .then(data => {
        if (!data.success || !data.room_data) return;

        let furniture = [];
        let colors = null;

        if (Array.isArray(data.room_data)) {
            furniture = data.room_data;
        } else {
            furniture = data.room_data.furniture || [];
            colors = data.room_data.colors;
        }

        furniture.forEach(item => addFurnitureToRoom(item.image, item.name, item));

        if (colors) {
            if (colors.topWall) {
                if (topWall) topWall.style.background = colors.topWall;
                if (topWallColor) topWallColor.value = colors.topWall;
            }
            if (colors.leftWall) {
                if (leftWall) leftWall.style.background = colors.leftWall;
                if (leftWallColor) leftWallColor.value = colors.leftWall;
            }
            if (colors.rightWall) {
                if (rightWall) rightWall.style.background = colors.rightWall;
                if (rightWallColor) rightWallColor.value = colors.rightWall;
            }
            if (colors.bottomWall) {
                if (bottomWall) bottomWall.style.background = colors.bottomWall;
                if (bottomWallColor) bottomWallColor.value = colors.bottomWall;
            }
            if (colors.floor) {
                if (floorArea) floorArea.style.background = colors.floor;
                if (floorColor) floorColor.value = colors.floor;
            }
        }
    });
}

if (topWallColor) topWallColor.addEventListener("input", () => { if (topWall) topWall.style.background = topWallColor.value; });
if (leftWallColor) leftWallColor.addEventListener("input", () => { if (leftWall) leftWall.style.background = leftWallColor.value; });
if (rightWallColor) rightWallColor.addEventListener("input", () => { if (rightWall) rightWall.style.background = rightWallColor.value; });
if (bottomWallColor) bottomWallColor.addEventListener("input", () => { if (bottomWall) bottomWall.style.background = bottomWallColor.value; });
if (floorColor) floorColor.addEventListener("input", () => { if (floorArea) floorArea.style.background = floorColor.value; });

if (clearBtn) clearBtn.addEventListener("click", () => { document.querySelectorAll(".placed-item-wrapper").forEach(w => w.remove()); });
if (saveBtn) saveBtn.addEventListener("click", saveRoomToDatabase);

if (roomBox) {
    roomBox.addEventListener("click", () => {
        document.querySelectorAll(".placed-item-wrapper").forEach(w => w.classList.remove("active"));
    });
}

if (furnitureList) loadFurnitureCategories();
loadSavedRoom();
