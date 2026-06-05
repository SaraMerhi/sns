const editorPage = document.querySelector(".editor-page");
const roomType = editorPage.getAttribute("data-room");

const furnitureList = document.querySelector("#furnitureList");
const roomBox = document.querySelector("#roomBox");
const clearBtn = document.querySelector("#clearBtn");
const saveBtn = document.querySelector("#saveBtn");
const nextBtn = document.querySelector("#nextBtn");

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

        "TV": [
            "/static/images/livingroom/TV5.png"
        ],

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
            "/static/images/livingroom/sofa5.png",

        ],
        "Table": [
            "/static/images/livingroom/table1.png",
            "/static/images/livingroom/table2.png",
            "/static/images/livingroom/table3.png",
            "/static/images/livingroom/table4.png",
            "/static/images/livingroom/table5.png"
        ],
        "TV": [
            "/static/images/livingroom/TV5.png"
        ],
        "TV Table": [
            "/static/images/livingroom/TV_table1.png",
            "/static/images/livingroom/TV_table2.png",
            "/static/images/livingroom/TV_table3.png",
            "/static/images/livingroom/TV_table4.png",
            "/static/images/livingroom/TV_table5.png"
        ]
    },

    "bathroom": {
        "Coming Soon": []
    },

    "kitchen": {
        "Coming Soon": []
    }
};

const categoryIcons = {
    "Bed": "🛏️",
    "Bedside Table": "🟤",
    "Closet": "🚪",
    "Arm Chair": "🪑",
    "Lamp": "💡",
    "Plant": "🪴",
    "Rug": "▭",
    "Sofa": "🛋️",
    "Table": "🟤",
    "TV Table": "▰",
    "TV": "📺",
    "Coming Soon": "🚧",
    "Desk": "🖥️",
    "Pouf": "🟣"
};

function loadFurnitureCategories() {
    furnitureList.innerHTML = "";

    const categories = furnitureByRoom[roomType];

    for (const categoryName in categories) {
        const item = document.createElement("div");
        item.classList.add("furniture-item");

        item.innerHTML = `
            <span class="furniture-icon">${categoryIcons[categoryName]}</span>
            <span class="furniture-name">${categoryName}</span>
        `;

        item.addEventListener("click", function () {
            showFurnitureOptions(categoryName);
        });

        furnitureList.appendChild(item);
    }
}

function showFurnitureOptions(categoryName) {
    furnitureList.innerHTML = "";

    const backButton = document.createElement("button");
    backButton.classList.add("back-category-btn");
    backButton.textContent = "← Back";

    backButton.addEventListener("click", function () {
        loadFurnitureCategories();
    });

    furnitureList.appendChild(backButton);

    const title = document.createElement("h3");
    title.classList.add("options-title");
    title.textContent = categoryName + " Options";
    furnitureList.appendChild(title);

    const options = furnitureByRoom[roomType][categoryName];

    if (options.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("no-options");
        empty.textContent = "No images added yet.";
        furnitureList.appendChild(empty);
        return;
    }

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("div");
        option.classList.add("furniture-option");

        option.innerHTML = `
            <img src="${options[i]}" alt="${categoryName}">
        `;

        option.addEventListener("click", function () {
            addFurnitureToRoom(options[i], categoryName);
        });

        furnitureList.appendChild(option);
    }
}

function addFurnitureToRoom(imagePath, furnitureName, savedData = null) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("placed-item-wrapper");

    wrapper.style.left = savedData ? savedData.left : "250px";
    wrapper.style.top = savedData ? savedData.top : "200px";
    wrapper.style.width = savedData ? savedData.width : "120px";
    wrapper.style.height = savedData ? savedData.height : "120px";

    const controls = document.createElement("div");
    controls.classList.add("furniture-controls");

    controls.innerHTML = `
        <button class="control-btn rotate-left">↺</button>
        <button class="control-btn rotate-right">↻</button>
        <button class="control-btn bigger">＋</button>
        <button class="control-btn smaller">－</button>
        <button class="control-btn delete-item">✕</button>
    `;

    const placedItem = document.createElement("img");
    placedItem.classList.add("placed-item");
    placedItem.src = imagePath;
    placedItem.alt = furnitureName;

    let rotation = savedData ? savedData.rotationValue : 0;
    placedItem.style.transform = "rotate(" + rotation + "deg)";

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

    wrapper.addEventListener("click", function (event) {
        event.stopPropagation();
        showControls(wrapper);
    });

    wrapper.appendChild(controls);
    wrapper.appendChild(placedItem);

    roomBox.appendChild(wrapper);

    makeMovable(wrapper);
}

function makeMovable(item) {
    let moving = false;
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener("mousedown", function (event) {
        if (event.target.classList.contains("control-btn")) {
            return;
        }

        moving = true;

        const itemRect = item.getBoundingClientRect();

        offsetX = event.clientX - itemRect.left;
        offsetY = event.clientY - itemRect.top;
    });

    document.addEventListener("mousemove", function (event) {
        if (moving === false) {
            return;
        }

        const roomRect = roomBox.getBoundingClientRect();

        let x = event.clientX - roomRect.left - offsetX;
        let y = event.clientY - roomRect.top - offsetY;

        if (x < 0) {
            x = 0;
        }

        if (y < 0) {
            y = 0;
        }

        if (x > roomBox.offsetWidth - item.offsetWidth) {
            x = roomBox.offsetWidth - item.offsetWidth;
        }

        if (y > roomBox.offsetHeight - item.offsetHeight) {
            y = roomBox.offsetHeight - item.offsetHeight;
        }

        item.style.left = x + "px";
        item.style.top = y + "px";
    });

    document.addEventListener("mouseup", function () {
        moving = false;
    });

    item.addEventListener("dblclick", function () {
        item.remove();
    });
}

function showControls(selectedWrapper) {
    const allWrappers = document.querySelectorAll(".placed-item-wrapper");

    for (let i = 0; i < allWrappers.length; i++) {
        allWrappers[i].classList.remove("active");
    }

    selectedWrapper.classList.add("active");
}

function collectRoomData() {
    const items = document.querySelectorAll(".placed-item-wrapper");
    const roomData = [];

    items.forEach(function (item) {
        const img = item.querySelector(".placed-item");
        const transform = img.style.transform || "rotate(0deg)";
        const rotationValue = parseInt(transform.replace("rotate(", "").replace("deg)", ""));

        roomData.push({
            image: img.getAttribute("src"),
            name: img.getAttribute("alt"),
            left: item.style.left,
            top: item.style.top,
            width: item.style.width,
            height: item.style.height,
            rotationValue: isNaN(rotationValue) ? 0 : rotationValue
        });
    });

    return roomData;
}

function saveRoomToDatabase(goNext) {
    const roomData = collectRoomData();

    fetch("/save-room-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            room_name: roomName,
            room_data: roomData
        })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data.success) {
            if (goNext) {
                window.location.href = "/room-complete/" + roomName;
            } else {
                alert("Room saved successfully!");
            }
        } else {
            alert(data.message);
        }
    });
}

function loadSavedRoom() {
    fetch("/get-room-data/" + roomName)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.success || !data.room_data) {
                return;
            }

            for (let i = 0; i < data.room_data.length; i++) {
                const item = data.room_data[i];

                addFurnitureToRoom(item.image, item.name, item);
            }
        });
}

topWallColor.addEventListener("input", function () {
    topWall.style.background = topWallColor.value;
});

leftWallColor.addEventListener("input", function () {
    leftWall.style.background = leftWallColor.value;
});

rightWallColor.addEventListener("input", function () {
    rightWall.style.background = rightWallColor.value;
});

bottomWallColor.addEventListener("input", function () {
    bottomWall.style.background = bottomWallColor.value;
});

floorColor.addEventListener("input", function () {
    floorArea.style.background = floorColor.value;
});

clearBtn.addEventListener("click", function () {
    const placedItems = document.querySelectorAll(".placed-item-wrapper");

    for (let i = 0; i < placedItems.length; i++) {
        placedItems[i].remove();
    }
});

saveBtn.addEventListener("click", function () {
    saveRoomToDatabase(false);
});

nextBtn.addEventListener("click", function () {
    saveRoomToDatabase(true);
});

roomBox.addEventListener("click", function () {
    const allWrappers = document.querySelectorAll(".placed-item-wrapper");

    for (let i = 0; i < allWrappers.length; i++) {
        allWrappers[i].classList.remove("active");
    }
});

loadFurnitureCategories();
loadSavedRoom();