// ==============================
// 获取页面
// ==============================

const homePage =
    document.getElementById("homePage");

const levelPage =
    document.getElementById("levelPage");

const gamePage =
    document.getElementById("gamePage");
    const peachGamePage =
    document.getElementById("peachGamePage");
    const rabbitGamePage =
    document.getElementById("rabbitGamePage");

const cultureModal =
    document.getElementById("cultureModal");


// ==============================
// 获取游戏阶段
// ==============================

const mixStage =
    document.getElementById("mixStage");

const kneadStage =
    document.getElementById("kneadStage");

const shapeStage =
    document.getElementById("shapeStage");

const decorateStage =
    document.getElementById("decorateStage");

    const steamStage =
    document.getElementById("steamStage");

const resultStage =
    document.getElementById("resultStage");
// ==============================
// 游戏状态
// ==============================

let waterAmount = 0;
let peachRoundAmount = 0;
let peachTipAmount = 0;
let peachGrooveAmount = 0;

let kneadAmount = 0;
let shapeAmount = 0;
let peachDecorStep = 0;

let peachHeatValue = 0;

let peachHeatDirection = 1;

let peachIsSteaming = false;

let peachSteamAnimationId = null;

let placedDecorations =
    new Set();
    const fishStageImages = {
    base: "images/fish-base.png",
    eye: "images/fish-no-scale-fin.png",
    scale: "images/fish-no-fin.png",
    main: "images/fish-main.png"
};


/* 提前加载，避免手机第一次切换时不显示 */

Object.values(
    fishStageImages
).forEach(
    function (src) {

        const image =
            new Image();

        image.src = src;

    }
);
  
    let heatValue = 0;

let heatDirection = 1;

let isSteaming = false;

let steamAnimationId = null;

let score = 0;

let isKneading = false;

let lastPointerX = null;


// ==============================
// 页面切换
// ==============================

function hidePages() {

    homePage.classList.remove("active");

    levelPage.classList.remove("active");

    gamePage.classList.remove("active");

    peachGamePage.classList.remove("active");

    rabbitGamePage.classList.remove("active");

}


function startGame() {

    hidePages();

    levelPage.classList.add("active");

    window.scrollTo(0, 0);

}


function goHome() {

    hidePages();

    homePage.classList.add("active");

    window.scrollTo(0, 0);

}


function backToLevels() {

    hidePages();

    levelPage.classList.add("active");

    window.scrollTo(0, 0);

}


// ==============================
// 打开关卡
// ==============================

function openLevel(levelName) {

    if (levelName === "fish") {

        hidePages();

        gamePage.classList.add("active");

        resetWholeLevel();

        window.scrollTo(0, 0);

        return;

    }


    if (levelName === "peach") {

    hidePages();

    peachGamePage.classList.add(
        "active"
    );

    resetPeachRound();

    window.scrollTo(0, 0);

    return;

}


  if (levelName === "rabbit") {

    hidePages();

    rabbitGamePage.classList.add(
        "active"
    );

    resetJituantuanLevel();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    return;
}

}


// ==============================
// 显示指定游戏阶段
// ==============================

function showGameStage(stageName) {

    mixStage.classList.remove("active-stage");
    kneadStage.classList.remove("active-stage");
    shapeStage.classList.remove("active-stage");
    decorateStage.classList.remove("active-stage");
    steamStage.classList.remove("active-stage");
    resultStage.classList.remove("active-stage");


    if (stageName === "mix") {
        mixStage.classList.add("active-stage");
    }

    if (stageName === "knead") {
        kneadStage.classList.add("active-stage");
    }

    if (stageName === "shape") {
        shapeStage.classList.add("active-stage");
    }

    if (stageName === "decorate") {
        decorateStage.classList.add("active-stage");
    }

    if (stageName === "steam") {
        steamStage.classList.add("active-stage");
    }

    if (stageName === "result") {
        resultStage.classList.add("active-stage");
    }

}
// ==============================
// 更新顶部步骤进度
// ==============================

function updateStepProgress(currentStep) {

    for (let step = 1; step <= 5; step += 1) {

        const item =
            document.getElementById(
                "stepItem" + step
            );

        item.classList.remove(
            "active",
            "completed"
        );


        if (step < currentStep) {

            item.classList.add("completed");

        }


        if (step === currentStep) {

            item.classList.add("active");

        }

    }

}


// ==============================
// 加水
// ==============================

function addWater() {

    const increase =
        8 + Math.floor(Math.random() * 5);

    waterAmount += increase;


    if (waterAmount > 100) {

        waterAmount = 100;

    }


    playWaterAnimation();

    updateMixingDisplay();

}


// ==============================
// 水滴动画
// ==============================

function playWaterAnimation() {

    const waterDrop =
        document.getElementById("waterDrop");

    waterDrop.classList.remove("falling");

    void waterDrop.offsetWidth;

    waterDrop.classList.add("falling");

}


// ==============================
// 点击面粉进行调整
// ==============================

function addFlour() {

    if (waterAmount <= 75) {

        document.getElementById(
            "mixMessage"
        ).textContent =
            "目前不需要加面粉，请继续观察水量。";

        return;

    }


    waterAmount -= 12;


    if (waterAmount < 0) {

        waterAmount = 0;

    }


    updateMixingDisplay();

}


// ==============================
// 更新和面界面
// ==============================

function updateMixingDisplay() {

    const meter =
        document.getElementById(
            "waterMeterFill"
        );

    const waterValue =
        document.getElementById(
            "waterValue"
        );

    const bowl =
        document.getElementById(
            "mixBowl"
        );

    const message =
        document.getElementById(
            "mixMessage"
        );

    const finishButton =
        document.getElementById(
            "finishMixButton"
        );


    meter.style.width =
        waterAmount + "%";

    waterValue.textContent =
        waterAmount;


    bowl.classList.remove(
        "correct-mixture",
        "too-wet"
    );


    if (waterAmount < 55) {

        message.textContent =
            "面团仍然偏干，请继续缓慢加水。";

        finishButton.disabled = true;

        return;

    }


    if (
        waterAmount >= 55 &&
        waterAmount <= 75
    ) {

        bowl.classList.add(
            "correct-mixture"
        );

        message.textContent =
            "水量合适，面团已经逐渐成形！";

        finishButton.disabled = false;

        return;

    }


    bowl.classList.add("too-wet");

    message.textContent =
        "水量偏多，请点击面粉区域进行调整。";

    finishButton.disabled = true;

}


// ==============================
// 完成和面并进入揉面
// ==============================

function finishMixing() {

    if (
        waterAmount < 55 ||
        waterAmount > 75
    ) {

        return;

    }


    score = 20;

    document.getElementById(
        "scoreText"
    ).textContent =
        score;


    resetKneading();

    showGameStage("knead");

    updateStepProgress(2);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==============================
// 重新和面
// ==============================

function resetMixing() {

    waterAmount = 0;


    document.getElementById(
        "waterMeterFill"
    ).style.width =
        "0%";


    document.getElementById(
        "waterValue"
    ).textContent =
        "0";


    document.getElementById(
        "mixMessage"
    ).textContent =
        "请点击“缓慢加水”";


    document.getElementById(
        "addWaterButton"
    ).disabled =
        false;


    document.getElementById(
        "finishMixButton"
    ).disabled =
        true;


    document.getElementById(
        "mixBowl"
    ).classList.remove(
        "correct-mixture",
        "too-wet"
    );

}


// ==============================
// 揉面小游戏
// ==============================

const kneadBoard =
    document.getElementById("kneadBoard");

const doughBall =
    document.getElementById("doughBall");


// 按下鼠标或手指

doughBall.addEventListener(
    "pointerdown",
    function (event) {

        isKneading = true;

        lastPointerX =
            event.clientX;

        doughBall.setPointerCapture(
    event.pointerId
);

        doughBall.classList.add(
            "kneading"
        );

    }
);


// 移动鼠标或手指

doughBall.addEventListener(
    "pointermove",
    function (event) {

        if (
            !isKneading ||
            lastPointerX === null
        ) {

            return;

        }


        const movement =
            Math.abs(
                event.clientX -
                lastPointerX
            );


        if (movement < 4) {

            return;

        }


        kneadAmount +=
            movement * 0.16;


        if (kneadAmount > 100) {

            kneadAmount = 100;

        }


        lastPointerX =
            event.clientX;


        updateKneadingDisplay();

    }
);


// 停止揉面

function stopKneading(event) {

    isKneading = false;

    lastPointerX = null;

    doughBall.classList.remove(
        "kneading"
    );


    if (
        event &&
        doughBall.hasPointerCapture(
    event.pointerId
)
    ) {

        doughBall.releasePointerCapture(
    event.pointerId
);
    }

}


doughBall.addEventListener(
    "pointerup",
    stopKneading
);

doughBall.addEventListener(
    "pointercancel",
    stopKneading
);

doughBall.addEventListener(
    "pointerleave",
    function () {

        isKneading = false;

        lastPointerX = null;

        doughBall.classList.remove(
            "kneading"
        );

    }
);


// ==============================
// 更新揉面显示
// ==============================

function updateKneadingDisplay() {

    document.getElementById(
        "kneadProgressFill"
    ).style.width =
        kneadAmount + "%";


    document.getElementById(
        "kneadValue"
    ).textContent =
        Math.round(kneadAmount);


    const wave =
        Math.sin(kneadAmount * 0.35);


    doughBall.style.transform =
        "scaleX(" +
        (1 + wave * 0.045) +
        ") scaleY(" +
        (1 - wave * 0.03) +
        ")";


    if (kneadAmount < 35) {

        document.getElementById(
            "kneadMessage"
        ).textContent =
            "继续左右滑动，面团还不够均匀。";

    } else if (kneadAmount < 70) {

        document.getElementById(
            "kneadMessage"
        ).textContent =
            "面团正在变得柔软，请继续揉制。";

    } else if (kneadAmount < 100) {

        document.getElementById(
            "kneadMessage"
        ).textContent =
            "快完成了，再揉几下！";

    }


    if (kneadAmount >= 100) {

        doughBall.classList.add(
            "smooth-dough"
        );

        doughBall.style.transform =
            "scale(1)";


        document.getElementById(
            "kneadGestureTip"
        ).style.display =
            "none";


        document.getElementById(
            "kneadMessage"
        ).textContent =
            "面团已经揉得光滑柔韧！";


        document.getElementById(
            "finishKneadButton"
        ).disabled =
            false;

    }

}


// ==============================
// 重新揉面
// ==============================

function resetKneading() {

    kneadAmount = 0;

    isKneading = false;

    lastPointerX = null;


    document.getElementById(
        "kneadProgressFill"
    ).style.width =
        "0%";


    document.getElementById(
        "kneadValue"
    ).textContent =
        "0";


    document.getElementById(
        "kneadMessage"
    ).textContent =
        "请按住面团左右来回滑动";


    document.getElementById(
        "kneadGestureTip"
    ).style.display =
        "block";


    document.getElementById(
        "finishKneadButton"
    ).disabled =
        true;


    doughBall.classList.remove(
        "smooth-dough",
        "kneading"
    );


    doughBall.style.transform =
        "scale(1)";

}


// ==============================
// 完成揉面
// ==============================



function finishKneading() {

    if (kneadAmount < 100) {

        return;

    }


    score = 40;


    document.getElementById(
        "scoreText"
    ).textContent =
        score;


    resetShaping();

    showGameStage("shape");

    updateStepProgress(3);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==============================
// 重置整个第一关
// ==============================
// ==============================
// 第三步：福鱼塑形
// ==============================

function pressFishShape() {

    shapeAmount +=
        10 + Math.floor(
            Math.random() * 5
        );


    if (shapeAmount > 100) {

        shapeAmount = 100;

    }


    playShapePressAnimation();

    updateShapingDisplay();

}


// 塑形按压动画

function playShapePressAnimation() {

    const shapeDough =
        document.getElementById(
            "shapeDough"
        );

    const pressEffect =
        document.getElementById(
            "shapePressEffect"
        );


    shapeDough.classList.remove(
        "press-animation"
    );

    pressEffect.classList.remove(
        "show-press"
    );


    void shapeDough.offsetWidth;


    shapeDough.classList.add(
        "press-animation"
    );

    pressEffect.classList.add(
        "show-press"
    );

}


// 更新塑形界面

function updateShapingDisplay() {

    const shapeDough =
        document.getElementById(
            "shapeDough"
        );

    const fishTail =
        document.getElementById(
            "fishTailShape"
        );

    const message =
        document.getElementById(
            "shapeMessage"
        );

    document.getElementById(
        "shapeProgressFill"
    ).style.width =
        shapeAmount + "%";


    document.getElementById(
        "shapeValue"
    ).textContent =
        shapeAmount;


    shapeDough.classList.remove(
        "shape-middle",
        "shape-complete"
    );


    fishTail.classList.remove(
        "show-tail"
    );


    if (shapeAmount < 35) {

        message.textContent =
            "面团仍然较厚，请继续均匀按压。";

        return;

    }


    if (shapeAmount < 75) {

        shapeDough.classList.add(
            "shape-middle"
        );

        message.textContent =
            "鱼身轮廓正在形成，请继续按压。";

        return;

    }


    if (shapeAmount < 100) {

        shapeDough.classList.add(
            "shape-complete"
        );

        fishTail.classList.add(
            "show-tail"
        );

        message.textContent =
            "鱼形已经基本完成，再按压几次。";

        return;

    }


    shapeDough.classList.add(
        "shape-complete"
    );

    fishTail.classList.add(
        "show-tail"
    );


    message.textContent =
        "福鱼轮廓已经清晰完整！";


    document.getElementById(
        "shapePressButton"
    ).disabled =
        true;


    document.getElementById(
        "finishShapeButton"
    ).disabled =
        false;

}


// 重新塑形

function resetShaping() {

    shapeAmount = 0;


    document.getElementById(
        "shapeProgressFill"
    ).style.width =
        "0%";


    document.getElementById(
        "shapeValue"
    ).textContent =
        "0";


    document.getElementById(
        "shapeMessage"
    ).textContent =
        "点击下侧按钮，将面团压入鱼形模具";


    document.getElementById(
        "shapePressButton"
    ).disabled =
        false;


    document.getElementById(
        "finishShapeButton"
    ).disabled =
        true;


    document.getElementById(
        "shapeDough"
    ).classList.remove(
        "shape-middle",
        "shape-complete",
        "press-animation"
    );


    document.getElementById(
        "fishTailShape"
    ).classList.remove(
        "show-tail"
    );

}


// 完成塑形

 function finishShaping() {

    if (shapeAmount < 100) {
        return;
    }


    score = 60;


    document.getElementById(
        "scoreText"
    ).textContent =
        score;


    resetDecorating();

    showGameStage(
        "decorate"
    );

    updateStepProgress(4);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==============================
// 第四步：福鱼拖拽装饰
// ==============================

const decorateCards =
    document.querySelectorAll(
        ".decorate-tool-card"
    );

decorateCards.forEach(
    function (card) {

        prepareDecorationDrag(card);

    }
);

// 为每个工具准备拖拽功能

function prepareDecorationDrag(card) {

    const picture =
        card.querySelector(
            ".decorate-tool-picture"
        );

    if (!picture) {
        return;
    }

    card.addEventListener(
        "pointerdown",
        function (event) {

            if (
                card.classList.contains(
                    "used"
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const targetName =
                card.dataset.target;

            const partName =
                card.dataset.part;

            const pictureRect =
                picture.getBoundingClientRect();

            const ghost =
                picture.cloneNode(true);

            ghost.classList.add(
                "drag-ghost"
            );

            ghost.style.width =
                pictureRect.width + "px";

            ghost.style.height =
                pictureRect.height + "px";

            document.body.appendChild(
                ghost
            );

            picture.classList.add(
                "drag-source-active"
            );

            let hasMoved = false;

            const startX =
                event.clientX;

            const startY =
                event.clientY;

            moveGhost(
                event.clientX,
                event.clientY
            );


            function moveGhost(x, y) {

                ghost.style.left =
                    (
                        x -
                        pictureRect.width / 2
                    ) + "px";

                ghost.style.top =
                    (
                        y -
                        pictureRect.height / 2
                    ) + "px";

            }


            function moveDecoration(
                moveEvent
            ) {

                moveEvent.preventDefault();

                const distance =
                    Math.abs(
                        moveEvent.clientX -
                        startX
                    ) +
                    Math.abs(
                        moveEvent.clientY -
                        startY
                    );

                if (distance > 5) {
                    hasMoved = true;
                }

                moveGhost(
                    moveEvent.clientX,
                    moveEvent.clientY
                );

                highlightDecorationZone(
                    moveEvent.clientX,
                    moveEvent.clientY,
                    targetName
                );

            }


            function endDecoration(
                upEvent
            ) {

                document.removeEventListener(
                    "pointermove",
                    moveDecoration
                );

                document.removeEventListener(
                    "pointerup",
                    endDecoration
                );

                document.removeEventListener(
                    "pointercancel",
                    cancelDecoration
                );

                picture.classList.remove(
                    "drag-source-active"
                );

                clearDecorationHighlights();

                if (ghost.isConnected) {
                    ghost.remove();
                }

               if (!hasMoved) {

    document.getElementById(
        "decorateMessage"
    ).textContent =
        "请按住装饰工具并拖到对应虚线位置。";

    return;
}

                const targetZone =
                    findDecorationZone(
                        upEvent.clientX,
                        upEvent.clientY,
                        targetName
                    );

                if (!targetZone) {

                    document.getElementById(
                        "decorateMessage"
                    ).textContent =
                        "位置不正确，请重新拖动。";

                    showWrongDecoration();

                    return;
                }

                placeDecoration(
                    card,
                    targetZone,
                    targetName,
                    partName
                );

            }


            function cancelDecoration() {

                document.removeEventListener(
                    "pointermove",
                    moveDecoration
                );

                document.removeEventListener(
                    "pointerup",
                    endDecoration
                );

                document.removeEventListener(
                    "pointercancel",
                    cancelDecoration
                );

                picture.classList.remove(
                    "drag-source-active"
                );

                clearDecorationHighlights();

                if (ghost.isConnected) {
                    ghost.remove();
                }

            }


            document.addEventListener(
                "pointermove",
                moveDecoration,
                {
                    passive: false
                }
            );

            document.addEventListener(
                "pointerup",
                endDecoration
            );

            document.addEventListener(
                "pointercancel",
                cancelDecoration
            );

        }
    );

}

// 清理拖拽状态

function cleanupDecorationDrag(
    picture,
    ghost,
    pointerId,
    moveFunction,
    endFunction,
    cancelFunction
) {

    if (
        picture.hasPointerCapture(
            pointerId
        )
    ) {
        picture.releasePointerCapture(
            pointerId
        );
    }


    picture.removeEventListener(
        "pointermove",
        moveFunction
    );


    picture.removeEventListener(
        "pointerup",
        endFunction
    );


    picture.removeEventListener(
        "pointercancel",
        cancelFunction
    );


    picture.classList.remove(
        "drag-source-active"
    );


    clearDecorationHighlights();


    if (ghost.isConnected) {
        ghost.remove();
    }

}


// 判断是否拖入正确区域

function findDecorationZone(
    x,
    y,
    targetName
) {

    const zone =
        document.querySelector(
            '.decorate-drop-zone[data-target="' +
            targetName +
            '"]'
        );

    if (!zone) {
        return null;
    }


    /*
       第一种判断：
       检查鼠标松开位置下面是不是目标框
    */

    const elementUnderPointer =
        document.elementFromPoint(x, y);

    if (
        elementUnderPointer &&
        (
            elementUnderPointer === zone ||
            zone.contains(elementUnderPointer)
        )
    ) {
        return zone;
    }


    /*
       第二种判断：
       扩大目标框范围，手机和电脑都更容易放入
    */

    const rect =
        zone.getBoundingClientRect();

    const padding = 85;

    const inside =
        x >= rect.left - padding &&
        x <= rect.right + padding &&
        y >= rect.top - padding &&
        y <= rect.bottom + padding;

    return inside ? zone : null;

}


// 正确位置变绿

function highlightDecorationZone(
    x,
    y,
    targetName
) {

    clearDecorationHighlights();


    const zone =
        findDecorationZone(
            x,
            y,
            targetName
        );


    if (zone) {
        zone.classList.add(
            "drop-ready"
        );
    }

}


// 清除绿色提示

function clearDecorationHighlights() {

    document
        .querySelectorAll(
            ".decorate-drop-zone"
        )
        .forEach(
            function (zone) {

                zone.classList.remove(
                    "drop-ready"
                );

            }
        );

}


// 放错位置时震动

function showWrongDecoration() {

    const board =
        document.getElementById(
            "fishDecorateBoard"
        );


    board.classList.remove(
        "wrong-drop"
    );


    void board.offsetWidth;


    board.classList.add(
        "wrong-drop"
    );


    setTimeout(
        function () {

            board.classList.remove(
                "wrong-drop"
            );

        },
        450
    );

}


// 正确放置装饰

function placeDecoration(
    card,
    zone,
    targetName,
    partName
) {

    if (
        zone.classList.contains(
            "filled"
        )
        
    ) {
        return;
    }


    zone.classList.add(
        "filled"
    );
zone.style.display =
    "none";
    card.classList.add(
        "used"
    );

    placedDecorations.add(
        targetName
    );


    if (partName === "eye") {

        zone.innerHTML =
            "<span>✓ 鱼眼完成</span>";

        document.getElementById(
            "decorateMessage"
        ).textContent =
            "鱼眼已经点出，福鱼更有神了！";

    }


    if (partName === "scale") {

        zone.innerHTML =
            "<span>✓ 鱼鳞完成</span>";

        document.getElementById(
            "decorateMessage"
        ).textContent =
            "鱼鳞纹样压制完成！";

    }


    if (partName === "fin") {

        zone.innerHTML =
            "<span>✓ 鱼鳍完成</span>";

        document.getElementById(
            "decorateMessage"
        ).textContent =
            "鱼鳍修整完成！";

    }


    updateFishDecorateImage();


    if (
        placedDecorations.size === 3
    ) {

        document.getElementById(
            "decorateMessage"
        ).textContent =
            "福鱼装饰全部完成！";

        document.getElementById(
            "finishDecorateButton"
        ).disabled =
            false;

    }

}
function updateFishDecorateImage() {

    const fishImage =
        document.getElementById(
            "fishDecorateImage"
        );

    if (!fishImage) {
        return;
    }


    const completedCount =
        placedDecorations.size;


    let nextSource =
        fishStageImages.base;

    let nextState =
        "base";


    /*
       完成第一个工具：显示鱼眼
    */

    if (completedCount === 1) {

        nextSource =
            fishStageImages.eye;

        nextState =
            "eye";

    }


    /*
       完成第二个工具：显示鱼眼和鱼鳞
    */

    if (completedCount === 2) {

        nextSource =
            fishStageImages.scale;

        nextState =
            "scale";

    }


    /*
       三项完成：显示完整福鱼
    */

    if (completedCount >= 3) {

        nextSource =
            fishStageImages.main;

        nextState =
            "main";

    }


    fishImage.classList.remove(
        "fish-image-base",
        "fish-image-eye",
        "fish-image-scale",
        "fish-image-main",
        "changing"
    );


    fishImage.classList.add(
        "changing"
    );


    const preloadImage =
        new Image();


    preloadImage.onload =
        function () {

            fishImage.src =
                nextSource;


            fishImage.classList.remove(
                "changing"
            );


            fishImage.classList.add(
                "fish-image-" +
                nextState
            );

        };


    preloadImage.onerror =
        function () {

            fishImage.classList.remove(
                "changing"
            );

            document.getElementById(
                "decorateMessage"
            ).textContent =
                "图片加载失败，请检查 images 文件夹中的文件名。";

        };


    preloadImage.src =
        nextSource;

}
// 重置装饰

function resetDecorating() {

    placedDecorations.clear();


    /* 恢复左侧鱼的初始状态 */

   const fishImage =
    document.getElementById(
        "fishDecorateImage"
    );

if (fishImage) {

    fishImage.src =
        fishStageImages.base;

    fishImage.classList.remove(
        "fish-image-eye",
        "fish-image-scale",
        "fish-image-main",
        "changing"
    );

    fishImage.classList.add(
        "fish-image-base"
    );

}

    /* 恢复提示文字和按钮 */

    const decorateMessage =
        document.getElementById(
            "decorateMessage"
        );

    if (decorateMessage) {

        decorateMessage.textContent =
            "按住图形，将它拖到对应虚线位置";

    }


    const finishButton =
        document.getElementById(
            "finishDecorateButton"
        );

    if (finishButton) {

        finishButton.disabled =
            true;

    }


    /* 恢复右侧三个工具 */

    document
        .querySelectorAll(
            ".decorate-tool-card"
        )
        .forEach(
            function (card) {

                card.classList.remove(
                    "used"
                );

            }
        );


    /* 恢复三个目标框 */

    const zoneData = [
        {
            id: "fishEyeZone",
            text: "鱼眼"
        },
        {
            id: "fishScaleZone",
            text: "鱼鳞"
        },
        {
            id: "fishFinZone",
            text: "鱼鳍"
        }
    ];


    zoneData.forEach(
        function (item) {

            const zone =
                document.getElementById(
                    item.id
                );

            if (!zone) {
                return;
            }

            zone.classList.remove(
                "filled",
                "drop-ready"
            );

            zone.style.display =
                "flex";

            zone.innerHTML =
                "<span>" +
                item.text +
                "</span>";

        }
    );

}


// 完成装饰

function finishDecorating() {

    if (placedDecorations.size < 3) {
        return;
    }

    score = 80;

    document.getElementById(
        "scoreText"
    ).textContent = score;

    resetSteaming();

    showGameStage("steam");

    updateStepProgress(5);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==============================
// 第五步：蒸制
// ==============================

function startSteaming() {

    if (isSteaming) {
        return;
    }

    isSteaming = true;

    document.getElementById(
        "startSteamButton"
    ).disabled = true;

    document.getElementById(
        "takeOutButton"
    ).disabled = false;

    document.getElementById(
        "steamMessage"
    ).textContent =
        "观察指针，在绿色区域及时出锅。";

    document.querySelector(
        ".steam-workbench"
    ).classList.add("steaming");

    moveHeatPointer();

}


function moveHeatPointer() {

    if (!isSteaming) {
        return;
    }

    heatValue +=
        0.55 * heatDirection;

    if (heatValue >= 100) {
        heatValue = 100;
        heatDirection = -1;
    }

    if (heatValue <= 0) {
        heatValue = 0;
        heatDirection = 1;
    }

    document.getElementById(
        "heatPointer"
    ).style.left =
        heatValue + "%";

    steamAnimationId =
        requestAnimationFrame(
            moveHeatPointer
        );

}


function stopSteamAnimation() {

    isSteaming = false;

    if (steamAnimationId !== null) {

        cancelAnimationFrame(
            steamAnimationId
        );

        steamAnimationId = null;
    }

}


function takeOutFish() {

    if (!isSteaming) {
        return;
    }

    stopSteamAnimation();

    document.querySelector(
        ".steam-workbench"
    ).classList.remove("steaming");

    document.getElementById(
        "takeOutButton"
    ).disabled = true;


    let steamScore = 0;


    if (
        heatValue >= 38 &&
        heatValue <= 68
    ) {

        steamScore = 20;

        document.getElementById(
            "steamMessage"
        ).textContent =
            "火候正好，福鱼面花松软饱满！";

    } else if (
        (
            heatValue >= 25 &&
            heatValue < 38
        ) ||
        (
            heatValue > 68 &&
            heatValue <= 82
        )
    ) {

        steamScore = 14;

        document.getElementById(
            "steamMessage"
        ).textContent =
            "火候接近合适，面花基本完成。";

    } else {

        steamScore = 8;

        document.getElementById(
            "steamMessage"
        ).textContent =
            "火候稍有偏差，下次可以更准确。";

    }


    score = 80 + steamScore;


    document.getElementById(
        "scoreText"
    ).textContent = score;


    setTimeout(
        showResultPage,
        700
    );

}


function resetSteaming() {

    stopSteamAnimation();

    heatValue = 0;
    heatDirection = 1;

    document.getElementById(
        "heatPointer"
    ).style.left = "0%";

    document.getElementById(
        "steamMessage"
    ).textContent =
        "准备开始蒸制";

    document.getElementById(
        "startSteamButton"
    ).disabled = false;

    document.getElementById(
        "takeOutButton"
    ).disabled = true;

    document.querySelector(
        ".steam-workbench"
    ).classList.remove("steaming");

}


function showResultPage() {

    showGameStage("result");

    document.getElementById(
        "finalScore"
    ).textContent = score;

    for (
        let step = 1;
        step <= 5;
        step += 1
    ) {

        const item =
            document.getElementById(
                "stepItem" + step
            );

        item.classList.remove("active");
        item.classList.add("completed");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function restartFishLevel() {

    resetWholeLevel();

    showGameStage("mix");

    updateStepProgress(1);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
function resetWholeLevel() {

    stopSteamAnimation();

    score = 0;

    document.getElementById(
        "scoreText"
    ).textContent = "0";

    resetMixing();

    resetKneading();

    resetShaping();

    resetDecorating();

    resetSteaming();

    showGameStage("mix");

    updateStepProgress(1);

}

// ==============================
// 文化弹窗
// ==============================

function showCulture() {

    cultureModal.classList.add("show");

}


function closeCulture() {

    cultureModal.classList.remove("show");

}


cultureModal.addEventListener(
    "click",
    function (event) {

        if (event.target === cultureModal) {

            closeCulture();

        }

    }
);

// ==============================
// 第二关：寿桃搓圆
// ==============================

function rollPeachDough() {

    peachRoundAmount +=
        10 + Math.floor(
            Math.random() * 6
        );


    if (peachRoundAmount > 100) {

        peachRoundAmount = 100;

    }


    playPeachRoundAnimation();

    updatePeachRoundDisplay();

}


function playPeachRoundAnimation() {

    const dough =
        document.getElementById(
            "peachRoundDough"
        );

    const hands =
        document.getElementById(
            "peachHandEffect"
        );


    dough.classList.remove(
        "rolling"
    );

    hands.classList.remove(
        "show"
    );


    void dough.offsetWidth;


    dough.classList.add(
        "rolling"
    );

    hands.classList.add(
        "show"
    );

}


function updatePeachRoundDisplay() {

    const dough =
        document.getElementById(
            "peachRoundDough"
        );

    const message =
        document.getElementById(
            "peachRoundMessage"
        );


    document.getElementById(
        "peachRoundFill"
    ).style.width =
        peachRoundAmount + "%";


    document.getElementById(
        "peachRoundValue"
    ).textContent =
        peachRoundAmount;


    dough.classList.remove(
        "half-round",
        "full-round"
    );


    if (peachRoundAmount < 40) {

        message.textContent =
            "面团形状还不均匀，请继续滚动。";

        return;

    }


    if (peachRoundAmount < 80) {

        dough.classList.add(
            "half-round"
        );

        message.textContent =
            "面团正在逐渐变圆，请继续搓制。";

        return;

    }


    if (peachRoundAmount < 100) {

        dough.classList.add(
            "full-round"
        );

        message.textContent =
            "面团已经很圆了，再搓几下。";

        return;

    }


    dough.classList.add(
        "full-round"
    );


    message.textContent =
        "面团已经搓得圆润光滑！";


    document.getElementById(
        "rollPeachButton"
    ).disabled =
        true;


    document.getElementById(
        "finishPeachRoundButton"
    ).disabled =
        false;

}


function resetPeachRound() {

    peachRoundAmount = 0;

    stopPeachSteaming();


    document.getElementById(
        "peachRoundFill"
    ).style.width = "0%";


    document.getElementById(
        "peachRoundValue"
    ).textContent = "0";


    document.getElementById(
        "peachScoreText"
    ).textContent = "40";


    document.getElementById(
        "peachRoundMessage"
    ).textContent =
        "点击按钮开始搓圆面团";


    document.getElementById(
        "rollPeachButton"
    ).disabled = false;


    document.getElementById(
        "finishPeachRoundButton"
    ).disabled = true;


    document.getElementById(
        "peachRoundDough"
    ).classList.remove(
        "half-round",
        "full-round",
        "rolling"
    );


    document.getElementById(
        "peachRoundStage"
    ).classList.add(
        "active-stage"
    );


    document.getElementById(
        "peachDecorStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachSteamStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachResultStage"
    ).classList.remove(
        "active-stage"
    );

}


function finishPeachRound() {

    if (peachRoundAmount < 100) {
        return;
    }


    document.getElementById(
        "peachScoreText"
    ).textContent = "60";


    resetPeachDecorStage();


    document.getElementById(
        "peachRoundStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachDecorStage"
    ).classList.add(
        "active-stage"
    );


    document.getElementById(
        "peachStepItem3"
    ).classList.remove(
        "active"
    );


    document.getElementById(
        "peachStepItem3"
    ).classList.add(
        "completed"
    );


    document.getElementById(
        "peachStepItem4"
    ).classList.add(
        "active"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==============================
// 寿桃第四步：捏桃尖、压桃沟、添加叶子
// ==============================

function decoratePeachTip() {

    if (peachDecorStep !== 0) {
        return;
    }


    const plainDough =
        document.getElementById(
            "peachPlainDough"
        );

    const peachImage =
        document.getElementById(
            "peachDecorImage"
        );

    const tipButton =
        document.getElementById(
            "peachTipButton"
        );

    const grooveButton =
        document.getElementById(
            "peachGrooveButton"
        );


    if (plainDough) {

        plainDough.classList.add(
            "peach-hidden"
        );

    }


    peachImage.src =
        "images/peach-base.png";

    peachImage.classList.remove(
        "peach-hidden",
        "hidden"
    );


    tipButton.disabled = true;

    tipButton.classList.add(
        "completed"
    );


    grooveButton.disabled = false;


    peachDecorStep = 1;


    document.getElementById(
        "peachDecorMessage"
    ).textContent =
        "桃尖已经捏好，请继续压出中央桃沟。";

}


function decoratePeachGroove() {

    if (peachDecorStep !== 1) {

        document.getElementById(
            "peachDecorMessage"
        ).textContent =
            "请先完成捏桃尖。";

        return;
    }


    const peachImage =
        document.getElementById(
            "peachDecorImage"
        );

    const plainDough =
        document.getElementById(
            "peachPlainDough"
        );

    const grooveButton =
        document.getElementById(
            "peachGrooveButton"
        );

    const leafCard =
        document.getElementById(
            "peachLeafCard"
        );

    const leafZone =
        document.getElementById(
            "peachLeafZone"
        );


    /* 保证普通面团已经隐藏 */

    if (plainDough) {

        plainDough.classList.add(
            "peach-hidden"
        );

    }


    /* 显示压好桃沟的寿桃 */

    peachImage.src =
        "images/peach-groove.png";

    peachImage.classList.remove(
        "peach-hidden",
        "hidden"
    );


    grooveButton.disabled = true;

    grooveButton.classList.add(
        "completed"
    );


    leafCard.classList.remove(
        "disabled"
    );


    leafZone.classList.add(
        "visible"
    );


    peachDecorStep = 2;


    document.getElementById(
        "peachDecorMessage"
    ).textContent =
        "桃沟压制完成，请将绿叶拖到寿桃顶部。";

}
// ==============================
// 寿桃绿叶拖拽
// ==============================

const peachLeafCard =
    document.getElementById(
        "peachLeafCard"
    );

const peachLeafTool =
    document.getElementById(
        "peachLeafTool"
    );


if (
    peachLeafCard &&
    peachLeafTool
) {

    peachLeafCard.addEventListener(
        "pointerdown",
        startPeachLeafDrag
    );

}


function startPeachLeafDrag(event) {

    /*
       只有完成桃沟后，
       peachDecorStep 才等于 2
    */

    if (peachDecorStep !== 2) {

        document.getElementById(
            "peachDecorMessage"
        ).textContent =
            "请先捏出桃尖并压出桃沟。";

        return;

    }


    if (
        peachLeafCard.classList.contains(
            "disabled"
        ) ||
        peachLeafCard.classList.contains(
            "used"
        )
    ) {

        return;

    }


    event.preventDefault();
    event.stopPropagation();


    const imageRect =
        peachLeafTool.getBoundingClientRect();


    const dragImage =
        peachLeafTool.cloneNode(true);


    dragImage.classList.add(
        "peach-leaf-drag-ghost"
    );


    dragImage.style.width =
        imageRect.width + "px";

    dragImage.style.height =
        imageRect.height + "px";


    document.body.appendChild(
        dragImage
    );


    let hasMoved = false;

    const startX =
        event.clientX;

    const startY =
        event.clientY;


    movePeachLeafImage(
        dragImage,
        event.clientX,
        event.clientY,
        imageRect
    );


    function moveLeaf(moveEvent) {

        moveEvent.preventDefault();


        const distance =
            Math.abs(
                moveEvent.clientX -
                startX
            ) +
            Math.abs(
                moveEvent.clientY -
                startY
            );


        if (distance > 5) {

            hasMoved = true;

        }


        movePeachLeafImage(
            dragImage,
            moveEvent.clientX,
            moveEvent.clientY,
            imageRect
        );


        updatePeachLeafTarget(
            moveEvent.clientX,
            moveEvent.clientY
        );

    }


    function finishLeaf(upEvent) {

        removePeachLeafListeners();


        if (dragImage.isConnected) {

            dragImage.remove();

        }


        clearPeachLeafTarget();


        if (!hasMoved) {

            document.getElementById(
                "peachDecorMessage"
            ).textContent =
                "请按住绿叶并拖到寿桃顶部。";

            return;

        }


        if (
            !isInsidePeachLeafTarget(
                upEvent.clientX,
                upEvent.clientY
            )
        ) {

            document.getElementById(
                "peachDecorMessage"
            ).textContent =
                "位置不正确，请拖到寿桃顶部虚线框。";

            showWrongPeachLeafDrop();

            return;

        }


        completePeachLeafDecoration();

    }


    function cancelLeaf() {

        removePeachLeafListeners();


        if (dragImage.isConnected) {

            dragImage.remove();

        }


        clearPeachLeafTarget();

    }


    function removePeachLeafListeners() {

        document.removeEventListener(
            "pointermove",
            moveLeaf
        );

        document.removeEventListener(
            "pointerup",
            finishLeaf
        );

        document.removeEventListener(
            "pointercancel",
            cancelLeaf
        );

    }


    document.addEventListener(
        "pointermove",
        moveLeaf,
        {
            passive: false
        }
    );


    document.addEventListener(
        "pointerup",
        finishLeaf
    );


    document.addEventListener(
        "pointercancel",
        cancelLeaf
    );

}


function movePeachLeafImage(
    dragImage,
    x,
    y,
    imageRect
) {

    dragImage.style.left =
        (
            x -
            imageRect.width / 2
        ) + "px";


    dragImage.style.top =
        (
            y -
            imageRect.height / 2
        ) + "px";

}


function isInsidePeachLeafTarget(
    x,
    y
) {

    const target =
        document.getElementById(
            "peachLeafZone"
        );


    if (!target) {

        return false;

    }


    const rect =
        target.getBoundingClientRect();


    /*
       扩大判定范围，
       电脑和手机都更容易放进去
    */

    const padding = 65;


    return (
        x >= rect.left - padding &&
        x <= rect.right + padding &&
        y >= rect.top - padding &&
        y <= rect.bottom + padding
    );

}


function updatePeachLeafTarget(
    x,
    y
) {

    const target =
        document.getElementById(
            "peachLeafZone"
        );


    if (
        isInsidePeachLeafTarget(
            x,
            y
        )
    ) {

        target.classList.add(
            "drop-ready"
        );

    } else {

        target.classList.remove(
            "drop-ready"
        );

    }

}


function clearPeachLeafTarget() {

    const target =
        document.getElementById(
            "peachLeafZone"
        );


    if (target) {

        target.classList.remove(
            "drop-ready"
        );

    }

}


function showWrongPeachLeafDrop() {

    const board =
        document.getElementById(
            "peachDecorBoard"
        );


    board.classList.remove(
        "wrong-drop"
    );


    void board.offsetWidth;


    board.classList.add(
        "wrong-drop"
    );


    setTimeout(
        function () {

            board.classList.remove(
                "wrong-drop"
            );

        },
        450
    );

}


function completePeachLeafDecoration() {

    document.getElementById(
        "peachDecorImage"
    ).src =
        "images/peach-main.png";


    document.getElementById(
        "peachLeafZone"
    ).classList.remove(
        "visible",
        "drop-ready"
    );


    document.getElementById(
        "peachLeafCard"
    ).classList.add(
        "used"
    );


    document.getElementById(
        "finishPeachDecorButton"
    ).disabled =
        false;


    document.getElementById(
        "peachDecorMessage"
    ).textContent =
        "桃尖、桃沟和绿叶已经全部完成！";


    peachDecorStep = 3;

}
function finishPeachDecorating() {

    if (peachDecorStep !== 3) {
        return;
    }


    document.getElementById(
        "peachScoreText"
    ).textContent = "80";


    resetPeachSteaming();


    document.getElementById(
        "peachDecorStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachSteamStage"
    ).classList.add(
        "active-stage"
    );


    document.getElementById(
        "peachStepItem4"
    ).classList.remove(
        "active"
    );


    document.getElementById(
        "peachStepItem4"
    ).classList.add(
        "completed"
    );


    document.getElementById(
        "peachStepItem5"
    ).classList.add(
        "active"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
function resetPeachDecorStage() {

    peachDecorStep = 0;


    const plainDough =
        document.getElementById(
            "peachPlainDough"
        );

    const peachImage =
        document.getElementById(
            "peachDecorImage"
        );

    const tipButton =
        document.getElementById(
            "peachTipButton"
        );

    const grooveButton =
        document.getElementById(
            "peachGrooveButton"
        );

    const leafCard =
        document.getElementById(
            "peachLeafCard"
        );

    const leafZone =
        document.getElementById(
            "peachLeafZone"
        );

    const finishButton =
        document.getElementById(
            "finishPeachDecorButton"
        );


    /*
       第四步初始状态：
       显示普通面团
       隐藏 peach-base
    */

    plainDough.classList.remove(
        "peach-hidden"
    );

    peachImage.src =
        "images/peach-base.png";

    peachImage.classList.add(
        "peach-hidden"
    );


    tipButton.disabled = false;

    tipButton.classList.remove(
        "completed"
    );


    grooveButton.disabled = true;

    grooveButton.classList.remove(
        "completed"
    );


    leafCard.classList.add(
        "disabled"
    );

    leafCard.classList.remove(
        "used"
    );


    leafZone.classList.remove(
        "visible",
        "drop-ready"
    );


    finishButton.disabled = true;


    document.getElementById(
        "peachDecorMessage"
    ).textContent =
        "请先点击“捏出桃尖”";

}
// ==============================
// 第五步：寿桃蒸制
// ==============================

function resetPeachSteaming() {

    stopPeachSteaming();


    peachHeatValue = 0;

    peachHeatDirection = 1;


    document.getElementById(
        "peachHeatPointer"
    ).style.left = "0%";


    document.getElementById(
        "peachSteamMessage"
    ).textContent =
        "准备开始蒸制";


    document.getElementById(
        "startPeachSteamButton"
    ).disabled = false;


    document.getElementById(
        "takeOutPeachButton"
    ).disabled = true;


    document.getElementById(
        "peachSteamWorkbench"
    ).classList.remove(
        "steaming"
    );

}

// ==============================
// 开始寿桃蒸制
// ==============================

function startPeachSteaming() {

    if (peachIsSteaming) {
        return;
    }

    peachIsSteaming = true;


    document.getElementById(
        "startPeachSteamButton"
    ).disabled = true;


    document.getElementById(
        "takeOutPeachButton"
    ).disabled = false;


    document.getElementById(
        "peachSteamMessage"
    ).textContent =
        "正在蒸制，请观察火候指针，在绿色区域及时出锅。";


    document.getElementById(
        "peachSteamWorkbench"
    ).classList.add(
        "steaming"
    );


    movePeachHeatPointer();

}
function movePeachHeatPointer() {

    if (!peachIsSteaming) {
        return;
    }

    peachHeatValue +=
        0.55 * peachHeatDirection;

    if (peachHeatValue >= 100) {

        peachHeatValue = 100;
        peachHeatDirection = -1;

    }

    if (peachHeatValue <= 0) {

        peachHeatValue = 0;
        peachHeatDirection = 1;

    }

    document.getElementById(
        "peachHeatPointer"
    ).style.left =
        peachHeatValue + "%";

    peachSteamAnimationId =
        requestAnimationFrame(
            movePeachHeatPointer
        );

}


function stopPeachSteaming() {

    peachIsSteaming = false;

    if (
        peachSteamAnimationId !== null
    ) {

        cancelAnimationFrame(
            peachSteamAnimationId
        );

        peachSteamAnimationId = null;

    }

}


function takeOutPeach() {

    if (!peachIsSteaming) {
        return;
    }

    stopPeachSteaming();

    document.getElementById(
        "peachSteamWorkbench"
    ).classList.remove(
        "steaming"
    );

    document.getElementById(
        "takeOutPeachButton"
    ).disabled = true;


    let steamPoints = 0;


    if (
        peachHeatValue >= 38 &&
        peachHeatValue <= 68
    ) {

        steamPoints = 20;

        document.getElementById(
            "peachSteamMessage"
        ).textContent =
            "火候正好，寿桃面花松软饱满！";

    } else if (
        (
            peachHeatValue >= 25 &&
            peachHeatValue < 38
        ) ||
        (
            peachHeatValue > 68 &&
            peachHeatValue <= 82
        )
    ) {

        steamPoints = 14;

        document.getElementById(
            "peachSteamMessage"
        ).textContent =
            "火候接近合适，寿桃顺利蒸熟。";

    } else {

        steamPoints = 8;

        document.getElementById(
            "peachSteamMessage"
        ).textContent =
            "火候稍有偏差，但寿桃已经完成。";

    }


    const finalPeachScore =
        80 + steamPoints;


    document.getElementById(
        "peachScoreText"
    ).textContent =
        finalPeachScore;

    document.getElementById(
        "peachFinalScoreText"
    ).textContent =
        finalPeachScore;

    document.getElementById(
        "peachStepItem5"
    ).classList.remove("active");

    document.getElementById(
        "peachStepItem5"
    ).classList.add("completed");


    setTimeout(
        function () {

            document.getElementById(
    "peachSteamStage"
).classList.remove(
    "active-stage"
);

            document.getElementById(
                "peachResultStage"
            ).classList.add(
                "active-stage"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        },
        650
    );

}


// ==============================
// 重置第四、五步
// ==============================

function resetPeachDecorSteam() {

    stopPeachSteaming();

    peachDecorStep = 0;

    peachHeatValue = 0;

    peachHeatDirection = 1;


    document.getElementById(
        "peachDecorImage"
    ).src =
        "images/peach-base.png";


    document.getElementById(
        "peachGrooveButton"
    ).disabled = false;

    document.getElementById(
        "peachGrooveButton"
    ).classList.remove(
        "completed"
    );


    document.getElementById(
        "peachLeafCard"
    ).classList.add(
        "disabled"
    );

    document.getElementById(
        "peachLeafCard"
    ).classList.remove(
        "used"
    );


    document.getElementById(
        "peachLeafZone"
    ).classList.remove(
        "visible",
        "drop-ready"
    );


    document.getElementById(
        "finishPeachDecorButton"
    ).disabled = true;


    document.getElementById(
        "startPeachSteamButton"
    ).disabled = true;


    document.getElementById(
        "takeOutPeachButton"
    ).disabled = true;


    document.getElementById(
        "peachHeatPointer"
    ).style.left = "0%";


    document.getElementById(
        "peachSteamWorkbench"
    ).classList.remove(
        "steaming"
    );


    document.getElementById(
        "peachDecorMessage"
    ).textContent =
        "请先点击“压出桃沟”";

}
function replayPeachLevel() {

    stopPeachSteaming();


    document.getElementById(
        "peachResultStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachSteamStage"
    ).classList.remove(
        "active-stage"
    );


    document.getElementById(
        "peachDecorStage"
    ).classList.remove(
        "active-stage"
    );


    resetPeachDecorStage();

    resetPeachSteaming();

    resetPeachRound();


    document.getElementById(
        "peachScoreText"
    ).textContent = "40";


    for (
        let step = 1;
        step <= 5;
        step += 1
    ) {

        const item =
            document.getElementById(
                "peachStepItem" + step
            );

        item.classList.remove(
            "active",
            "completed"
        );

    }


    document.getElementById(
        "peachStepItem1"
    ).classList.add(
        "completed"
    );


    document.getElementById(
        "peachStepItem2"
    ).classList.add(
        "completed"
    );


    document.getElementById(
        "peachStepItem3"
    ).classList.add(
        "active"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ==============================
// 第三关：冀团团
// ==============================
// ==================================================
// 预加载冀团团装饰阶段图片
// ==================================================


let cuteRabbitStep = 0;


// ==============================
// 玉兔：拖拽装饰
// ==============================

let rabbitDecorCompleted = 0;

let activeRabbitDecorPiece = null;


function initializeRabbitDecorationDrag() {

    const pieces =
        document.querySelectorAll(
            ".rabbit-drag-piece"
        );

    pieces.forEach(function (piece) {

        piece.onpointerdown =
            startRabbitDecorationDrag;

    });

}


function startRabbitDecorationDrag(event) {

    const piece = event.currentTarget;

    if (
        piece.classList.contains(
            "placed"
        )
    ) {
        return;
    }

    activeRabbitDecorPiece = piece;

    piece.setPointerCapture(
        event.pointerId
    );

    piece.style.position = "fixed";

    piece.style.zIndex = "9999";

    piece.style.pointerEvents = "none";

    moveRabbitDecorationPiece(event);


    piece.onpointermove =
        moveRabbitDecorationPiece;

    piece.onpointerup =
        endRabbitDecorationDrag;

    piece.onpointercancel =
        endRabbitDecorationDrag;

}


function moveRabbitDecorationPiece(event) {

    if (!activeRabbitDecorPiece) {
        return;
    }

    const width =
        activeRabbitDecorPiece.offsetWidth;

    const height =
        activeRabbitDecorPiece.offsetHeight;

    activeRabbitDecorPiece.style.left =
        event.clientX -
        width / 2 +
        "px";

    activeRabbitDecorPiece.style.top =
        event.clientY -
        height / 2 +
        "px";


    document.querySelectorAll(
        ".rabbit-drop-zone"
    ).forEach(function (zone) {

        zone.classList.remove(
            "drag-over"
        );

    });


    const zone =
        getRabbitDropZoneAtPoint(
            event.clientX,
            event.clientY
        );

    if (zone) {

        zone.classList.add(
            "drag-over"
        );

    }

}


function getRabbitDropZoneAtPoint(
    clientX,
    clientY
) {

    const zones =
        document.querySelectorAll(
            ".rabbit-drop-zone:not(.completed)"
        );

    for (
        let index = 0;
        index < zones.length;
        index += 1
    ) {

        const zone = zones[index];

        const rect =
            zone.getBoundingClientRect();

        if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        ) {

            return zone;

        }

    }

    return null;

}


function endRabbitDecorationDrag(event) {

    if (!activeRabbitDecorPiece) {
        return;
    }

    const piece =
        activeRabbitDecorPiece;

    const zone =
        getRabbitDropZoneAtPoint(
            event.clientX,
            event.clientY
        );


    document.querySelectorAll(
        ".rabbit-drop-zone"
    ).forEach(function (item) {

        item.classList.remove(
            "drag-over"
        );

    });


    if (
        zone &&
        zone.dataset.decoration ===
        piece.dataset.decoration
    ) {

        completeRabbitDecoration(
            piece,
            zone
        );

    } else {

        returnRabbitDecorationPiece(
            piece
        );

        document.getElementById(
            "rabbitDecorMessage"
        ).textContent =
            "位置不正确，请拖到对应的虚线区域。";

    }


    piece.onpointermove = null;
    piece.onpointerup = null;
    piece.onpointercancel = null;

    activeRabbitDecorPiece = null;

}


function completeRabbitDecoration(
    piece,
    zone
) {

    const decoration =
        piece.dataset.decoration;


    zone.classList.add("completed");

    zone.textContent =
        decoration === "flower"
            ? "🌸"
            : "☁";


    piece.classList.add("placed");

    piece.style.position = "";

    piece.style.left = "";

    piece.style.top = "";

    piece.style.zIndex = "";

    piece.style.pointerEvents = "";


    rabbitDecorCompleted += 1;


    document.getElementById(
        "rabbitDecorCount"
    ).textContent =
        rabbitDecorCompleted;


    if (rabbitDecorCompleted < 2) {

        document.getElementById(
            "rabbitDecorMessage"
        ).textContent =
            "装饰放置成功，请继续拖动另一个图案。";

        return;

    }


    document.getElementById(
        "rabbitDecorMessage"
    ).textContent =
        "花纹和祥云装饰完成！";


    document.getElementById(
        "finishRabbitDecorButton"
    ).disabled = false;


    document.getElementById(
        "rabbitScoreText"
    ).textContent = "85";

}


function returnRabbitDecorationPiece(
    piece
) {

    piece.style.position = "";

    piece.style.left = "";

    piece.style.top = "";

    piece.style.zIndex = "";

    piece.style.pointerEvents = "";

}


function resetRabbitDecor() {

    rabbitDecorCompleted = 0;

    activeRabbitDecorPiece = null;


    document.getElementById(
        "rabbitDecorCount"
    ).textContent = "0";


    document.getElementById(
        "rabbitDecorMessage"
    ).textContent =
        "请拖动下方图案，放到对应的虚线区域";


    document.getElementById(
        "finishRabbitDecorButton"
    ).disabled = true;


    document.querySelectorAll(
        ".rabbit-drop-zone"
    ).forEach(function (zone) {

        zone.classList.remove(
            "completed",
            "drag-over"
        );

        zone.textContent =
            zone.dataset.decoration ===
            "flower"
                ? "花纹"
                : "祥云";

    });


    document.querySelectorAll(
        ".rabbit-drag-piece"
    ).forEach(function (piece) {

        piece.classList.remove(
            "placed"
        );

        returnRabbitDecorationPiece(
            piece
        );

    });


    initializeRabbitDecorationDrag();

}


function finishRabbitDecor() {

    if (rabbitDecorCompleted < 2) {
        return;
    }

    document.getElementById(
        "rabbitScoreText"
    ).textContent = "85";

    document.getElementById(
        "rabbitDecorStage"
    ).classList.remove(
        "active-stage"
    );

    document.getElementById(
        "rabbitSteamStage"
    ).classList.add(
        "active-stage"
    );

    document.getElementById(
        "rabbitStepItem4"
    ).classList.remove("active");

    document.getElementById(
        "rabbitStepItem4"
    ).classList.add("completed");

    document.getElementById(
        "rabbitStepItem5"
    ).classList.add("active");

    resetRabbitSteam();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==============================
// 玉兔：蒸制
// ==============================

let rabbitSteamValue = 0;

let rabbitSteamDirection = 1;

let rabbitIsSteaming = false;

let rabbitSteamAnimationId = null;


function startRabbitSteam() {

    if (rabbitIsSteaming) {
        return;
    }

    rabbitIsSteaming = true;

    document.getElementById(
        "startRabbitSteamButton"
    ).disabled = true;

    document.getElementById(
        "takeOutRabbitButton"
    ).disabled = false;

    document.getElementById(
        "rabbitSteamWorkbench"
    ).classList.add("steaming");

    document.getElementById(
        "rabbitSteamMessage"
    ).textContent =
        "观察指针，在绿色区域及时出锅。";

    moveRabbitSteamPointer();

}


function moveRabbitSteamPointer() {

    if (!rabbitIsSteaming) {
        return;
    }

    rabbitSteamValue +=
        0.55 * rabbitSteamDirection;

    if (rabbitSteamValue >= 100) {

        rabbitSteamValue = 100;

        rabbitSteamDirection = -1;
    }

    if (rabbitSteamValue <= 0) {

        rabbitSteamValue = 0;

        rabbitSteamDirection = 1;
    }

    document.getElementById(
        "rabbitSteamPointer"
    ).style.left =
        rabbitSteamValue + "%";

    rabbitSteamAnimationId =
        requestAnimationFrame(
            moveRabbitSteamPointer
        );

}


function stopRabbitSteam() {

    rabbitIsSteaming = false;

    if (
        rabbitSteamAnimationId !== null
    ) {

        cancelAnimationFrame(
            rabbitSteamAnimationId
        );

        rabbitSteamAnimationId = null;
    }

}


function takeOutRabbit() {

    if (!rabbitIsSteaming) {
        return;
    }

    stopRabbitSteam();

    document.getElementById(
        "rabbitSteamWorkbench"
    ).classList.remove("steaming");

    document.getElementById(
        "takeOutRabbitButton"
    ).disabled = true;


    let steamScore = 0;


    if (
        rabbitSteamValue >= 38 &&
        rabbitSteamValue <= 68
    ) {

        steamScore = 15;

        document.getElementById(
            "rabbitSteamMessage"
        ).textContent =
            "火候正好，玉兔松软饱满！";

    } else if (
        rabbitSteamValue >= 25 &&
        rabbitSteamValue <= 82
    ) {

        steamScore = 10;

        document.getElementById(
            "rabbitSteamMessage"
        ).textContent =
            "火候接近合适，玉兔顺利蒸熟。";

    } else {

        steamScore = 5;

        document.getElementById(
            "rabbitSteamMessage"
        ).textContent =
            "火候稍有偏差，但玉兔已经完成。";

    }


    const rabbitFinalScore =
        85 + steamScore;


    document.getElementById(
        "rabbitScoreText"
    ).textContent =
        rabbitFinalScore;


    document.getElementById(
        "steamedRabbitArtwork"
    ).classList.add("cooked");


    document.getElementById(
        "rabbitStepItem5"
    ).classList.remove("active");

    document.getElementById(
        "rabbitStepItem5"
    ).classList.add("completed");


    document.getElementById(
    "rabbitFinalScoreText"
).textContent =
    rabbitFinalScore;


setTimeout(function () {

    document.getElementById(
        "rabbitSteamStage"
    ).classList.remove(
        "active-stage"
    );

    document.getElementById(
        "rabbitResultStage"
    ).classList.add(
        "active-stage"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}, 650);

}


function resetRabbitSteam() {

    stopRabbitSteam();

    rabbitSteamValue = 0;

    rabbitSteamDirection = 1;


    document.getElementById(
        "rabbitSteamPointer"
    ).style.left = "0%";


    document.getElementById(
        "startRabbitSteamButton"
    ).disabled = false;


    document.getElementById(
        "takeOutRabbitButton"
    ).disabled = true;


    document.getElementById(
        "rabbitSteamWorkbench"
    ).classList.remove("steaming");


    document.getElementById(
        "steamedRabbitArtwork"
    ).classList.remove("cooked");


    document.getElementById(
        "rabbitSteamMessage"
    ).textContent =
        "点击“开始蒸制”";

}

function replayRabbitLevel() {

    document.getElementById(
        "rabbitResultStage"
    ).classList.remove(
        "active-stage"
    );

    resetCuteRabbitShape();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

let fishDecorCount = 0;

// ==================================================
// 第三关：冀团团面鸡
// ==================================================
// ==================================================
// 预加载冀团团装饰阶段图片
// ==================================================

const jituantuanImageSources = [
    "images/jituantuan-base.png",
    "images/jituantuan-after-crest.png",
    "images/jituantuan-after-face.png",
    "images/jituantuan-main.png"
];

const jituantuanPreloadedImages = {};
function preloadJituantuanImages() {

    jituantuanImageSources.forEach(
        function (src) {

            const image =
                jituantuanPreloadedImages[src];

            if (!image.complete) {

                image.src = src;

            }

        }
    );

}
jituantuanImageSources.forEach(function (src) {

    const image = new Image();

    image.src = src;

    jituantuanPreloadedImages[src] =
        image;

});
let jituantuanMouldAmount = 0;
let jituantuanDecorStep = 0;

let jituantuanHeatValue = 0;
let jituantuanHeatDirection = 1;

let jituantuanIsSteaming = false;
let jituantuanSteamAnimationId = null;


// ==================================================
// 通用：显示第三关指定阶段
// ==================================================

function showJituantuanStage(stageId) {

    const stages =
        document.querySelectorAll(
            "#rabbitGamePage .game-stage"
        );

    stages.forEach(function (stage) {

        stage.classList.remove(
            "active-stage"
        );

    });

    const targetStage =
        document.getElementById(stageId);

    if (!targetStage) {

        console.error(
            "找不到第三关阶段：",
            stageId
        );

        return;
    }

    targetStage.classList.add(
        "active-stage"
    );

}


// ==================================================
// 通用：更新第三关步骤条
// ==================================================

function updateJituantuanProgress(
    currentStep
) {

    for (
        let step = 1;
        step <= 5;
        step += 1
    ) {

        const item =
            document.getElementById(
                "rabbitStepItem" + step
            );

        if (!item) {
            continue;
        }

        item.classList.remove(
            "active",
            "completed"
        );


        if (step < currentStep) {

            item.classList.add(
                "completed"
            );

        }


        if (step === currentStep) {

            item.classList.add(
                "active"
            );

        }

    }

}


// ==================================================
// 第三步：压模
// ==================================================

function pressJituantuanMould() {

    if (jituantuanMouldAmount >= 100) {
        return;
    }


    const increase =
        12 +
        Math.floor(
            Math.random() * 7
        );


    jituantuanMouldAmount +=
        increase;


    if (jituantuanMouldAmount > 100) {

        jituantuanMouldAmount = 100;

    }


    const pressEffect =
        document.getElementById(
            "jituantuanPressEffect"
        );


    if (pressEffect) {

        pressEffect.classList.remove(
            "show"
        );

        void pressEffect.offsetWidth;

        pressEffect.classList.add(
            "show"
        );

    }


    updateJituantuanMouldDisplay();

}


function updateJituantuanMouldDisplay() {

    const fill =
        document.getElementById(
            "jituantuanMouldFill"
        );

    const value =
        document.getElementById(
            "jituantuanMouldValue"
        );

    const message =
        document.getElementById(
            "jituantuanMouldMessage"
        );

    const pressButton =
        document.getElementById(
            "pressJituantuanButton"
        );

    const finishButton =
        document.getElementById(
            "finishJituantuanMouldButton"
        );
const doughLayer =
    document.getElementById(
        "jituantuanDoughLayer"
    );

const baseLayer =
    document.getElementById(
        "jituantuanBaseLayer"
    );

    if (fill) {

        fill.style.width =
            jituantuanMouldAmount + "%";

    }


    if (value) {

        value.textContent =
            jituantuanMouldAmount;

    }
// 将0—100的压模进度转换成0—1

const mouldProgress =
    jituantuanMouldAmount / 100;


// 普通面团逐渐消失

if (doughLayer) {

    doughLayer.style.opacity =
        String(1 - mouldProgress);

    doughLayer.style.transform =
        "scale(" +
        (0.78 + mouldProgress * 0.12) +
        ")";

}


// 冀团团基础轮廓逐渐出现

if (baseLayer) {

    baseLayer.style.opacity =
        String(mouldProgress);

    baseLayer.style.transform =
        "scale(" +
        (0.82 + mouldProgress * 0.18) +
        ")";

    baseLayer.style.filter =
        "blur(" +
        (3 - mouldProgress * 3) +
        "px) drop-shadow(" +
        "0 9px 11px rgba(124, 57, 31, 0.16)" +
        ")";

}
    if (jituantuanMouldAmount < 35) {

        message.textContent =
            "面团刚刚放入模具，请继续均匀按压。";

        return;

    }


    if (jituantuanMouldAmount < 70) {

        message.textContent =
            "面鸡的身体轮廓正在逐渐形成。";

        return;

    }


    if (jituantuanMouldAmount < 100) {

        message.textContent =
            "冀团团已经基本成型，再按压几次。";

        return;

    }


    message.textContent =
        "冀团团基础面鸡已经压模完成！";


    pressButton.disabled = true;

    finishButton.disabled = false;


    document.getElementById(
        "rabbitScoreText"
    ).textContent = "60";

}


function finishJituantuanMould() {

    if (jituantuanMouldAmount < 100) {
        return;
    }


    document.getElementById(
        "rabbitScoreText"
    ).textContent = "60";


    resetJituantuanDecor();

    showJituantuanStage(
        "rabbitDecorStage"
    );
setupJituantuanDragTools();
    updateJituantuanProgress(4);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function resetJituantuanMould() {

    jituantuanMouldAmount = 0;


    document.getElementById(
        "jituantuanMouldFill"
    ).style.width = "0%";


    document.getElementById(
        "jituantuanMouldValue"
    ).textContent = "0";


    document.getElementById(
        "jituantuanMouldMessage"
    ).textContent =
        "点击按钮，将面团压入面鸡模具";


    document.getElementById(
        "pressJituantuanButton"
    ).disabled = false;


    document.getElementById(
        "finishJituantuanMouldButton"
    ).disabled = true;

    const doughLayer =
    document.getElementById(
        "jituantuanDoughLayer"
    );

const baseLayer =
    document.getElementById(
        "jituantuanBaseLayer"
    );


if (doughLayer) {

    doughLayer.style.opacity = "1";

    doughLayer.style.transform =
        "scale(0.78)";

}


if (baseLayer) {

    baseLayer.style.opacity = "0";

    baseLayer.style.transform =
        "scale(0.82)";

    baseLayer.style.filter =
        "blur(3px) drop-shadow(" +
        "0 9px 11px rgba(124, 57, 31, 0.16)" +
        ")";

}

}


// ==================================================
// 第四步：装饰冀团团
// ==================================================



function finishJituantuanDecor() {

    if (jituantuanDecorStep !== 3) {
        return;
    }


    resetJituantuanSteam();


    showJituantuanStage(
        "rabbitSteamStage"
    );


    updateJituantuanProgress(5);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function resetJituantuanDecor() {

    jituantuanDecorStep = 0;


    const stageImage =
        document.getElementById(
            "jituantuanDecorImage"
        );


    if (stageImage) {

        stageImage.src =
            "images/jituantuan-base.png";

    }
stageImage.classList.remove(
    "after-crest-size",
    "after-face-size"
);
    const crestTool =
        document.getElementById(
            "jituantuanCrestTool"
        );

    const faceTool =
        document.getElementById(
            "jituantuanFaceTool"
        );

    const wingsTool =
        document.getElementById(
            "jituantuanWingsTool"
        );


    [
        crestTool,
        faceTool,
        wingsTool
    ].forEach(function (tool) {

        if (!tool) {
            return;
        }


        tool.classList.remove(
            "active-tool",
            "completed-tool",
            "dragging"
        );


        tool.style.left = "";
        tool.style.top = "";

    });


    if (crestTool) {

        crestTool.classList.add(
            "active-tool"
        );

    }


    if (faceTool) {

        faceTool.classList.add(
            "locked-tool"
        );

    }


    if (wingsTool) {

        wingsTool.classList.add(
            "locked-tool"
        );

    }


    [
        "jituantuanCrestTarget",
        "jituantuanFaceTarget",
        "jituantuanWingsTarget"
    ].forEach(function (id) {

        const target =
            document.getElementById(id);


        if (target) {

            target.classList.remove(
                "active-target"
            );

        }

    });


    const crestTarget =
        document.getElementById(
            "jituantuanCrestTarget"
        );


    if (crestTarget) {

        crestTarget.classList.add(
            "active-target"
        );

    }


    document.getElementById(
        "finishJituantuanDecorButton"
    ).disabled = true;


    document.getElementById(
        "jituantuanDecorMessage"
    ).textContent =
        "请将彩色鸡冠拖到冀团团的头顶";

}

// ==================================================
// 第五步：蒸制
// ==================================================

function startJituantuanSteam() {

    if (jituantuanIsSteaming) {
        return;
    }


    jituantuanIsSteaming = true;


    document.getElementById(
        "startJituantuanSteamButton"
    ).disabled = true;


    document.getElementById(
        "takeOutJituantuanButton"
    ).disabled = false;


    document.getElementById(
        "jituantuanSteamMessage"
    ).textContent =
        "观察火候指针，在绿色区域及时出锅。";


    document.getElementById(
        "jituantuanSteamWorkbench"
    ).classList.add("steaming");


    moveJituantuanHeatPointer();

}


function moveJituantuanHeatPointer() {

    if (!jituantuanIsSteaming) {
        return;
    }


    jituantuanHeatValue +=
        0.55 *
        jituantuanHeatDirection;


    if (jituantuanHeatValue >= 100) {

        jituantuanHeatValue = 100;

        jituantuanHeatDirection = -1;

    }


    if (jituantuanHeatValue <= 0) {

        jituantuanHeatValue = 0;

        jituantuanHeatDirection = 1;

    }


    document.getElementById(
        "jituantuanHeatPointer"
    ).style.left =
        jituantuanHeatValue + "%";


    jituantuanSteamAnimationId =
        requestAnimationFrame(
            moveJituantuanHeatPointer
        );

}


function stopJituantuanSteam() {

    jituantuanIsSteaming = false;


    if (
        jituantuanSteamAnimationId !==
        null
    ) {

        cancelAnimationFrame(
            jituantuanSteamAnimationId
        );

        jituantuanSteamAnimationId =
            null;

    }

}


function takeOutJituantuan() {

    if (!jituantuanIsSteaming) {
        return;
    }


    stopJituantuanSteam();


    document.getElementById(
        "jituantuanSteamWorkbench"
    ).classList.remove("steaming");


    document.getElementById(
        "takeOutJituantuanButton"
    ).disabled = true;


    let steamScore = 0;


    if (
        jituantuanHeatValue >= 38 &&
        jituantuanHeatValue <= 68
    ) {

        steamScore = 20;

        document.getElementById(
            "jituantuanSteamMessage"
        ).textContent =
            "火候正好，冀团团面鸡松软饱满！";

    } else if (
        jituantuanHeatValue >= 25 &&
        jituantuanHeatValue <= 82
    ) {

        steamScore = 14;

        document.getElementById(
            "jituantuanSteamMessage"
        ).textContent =
            "火候接近合适，面鸡顺利完成。";

    } else {

        steamScore = 8;

        document.getElementById(
            "jituantuanSteamMessage"
        ).textContent =
            "火候稍有偏差，下次可以更准确。";

    }


    const finalScore =
        80 + steamScore;


    document.getElementById(
        "rabbitScoreText"
    ).textContent =
        finalScore;


    document.getElementById(
        "rabbitFinalScoreText"
    ).textContent =
        finalScore;


    setTimeout(function () {

        showJituantuanStage(
            "rabbitResultStage"
        );


        for (
            let step = 1;
            step <= 5;
            step += 1
        ) {

            const item =
                document.getElementById(
                    "rabbitStepItem" + step
                );

            if (item) {

                item.classList.remove(
                    "active"
                );

                item.classList.add(
                    "completed"
                );

            }

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 650);

}


function resetJituantuanSteam() {

    stopJituantuanSteam();


    jituantuanHeatValue = 0;

    jituantuanHeatDirection = 1;


    document.getElementById(
        "jituantuanHeatPointer"
    ).style.left = "0%";


    document.getElementById(
        "jituantuanSteamMessage"
    ).textContent =
        "准备开始蒸制";


    document.getElementById(
        "startJituantuanSteamButton"
    ).disabled = false;


    document.getElementById(
        "takeOutJituantuanButton"
    ).disabled = true;


    document.getElementById(
        "jituantuanSteamWorkbench"
    ).classList.remove("steaming");

}


// ==================================================
// 重置和重玩第三关
// ==================================================

function resetJituantuanLevel() {

    stopJituantuanSteam();


    document.getElementById(
        "rabbitScoreText"
    ).textContent = "40";


    resetJituantuanMould();

    resetJituantuanDecor();

    resetJituantuanSteam();


    showJituantuanStage(
        "rabbitMouldStage"
    );

    updateJituantuanProgress(3);

}


function replayJituantuanLevel() {

    resetJituantuanLevel();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==================================================
// 第三关：拖动装饰
// ==================================================


let currentJituantuanDragTool = null;


// 页面加载后启用拖动

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupJituantuanDragTools();

    }
);

// ==================================================
// 第三关：只拖动装饰图片
// ==================================================

let currentJituantuanDragImage = null;
let currentJituantuanPointerId = null;


// 初始化拖拽

function setupJituantuanDragTools() {

    const dragImages =
        document.querySelectorAll(
            ".jituantuan-drag-image"
        );


    dragImages.forEach(function (image) {

        image.removeEventListener(
            "pointerdown",
            startJituantuanDrag
        );


        image.addEventListener(
            "pointerdown",
            startJituantuanDrag
        );


        image.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();

            }
        );

    });

}


// 开始拖动

function startJituantuanDrag(event) {

    const image =
        event.currentTarget;


    const tool =
        image.closest(
            ".jituantuan-drag-tool"
        );


    if (!tool) {
        return;
    }


    if (
        tool.classList.contains(
            "locked-tool"
        ) ||
        tool.classList.contains(
            "completed-tool"
        )
    ) {

        return;

    }


    event.preventDefault();


    currentJituantuanDragImage =
        image;


    currentJituantuanPointerId =
        event.pointerId;


    image.classList.add(
        "dragging"
    );


    moveJituantuanDragImage(event);


    document.addEventListener(
        "pointermove",
        moveJituantuanDragImage,
        { passive: false }
    );


    document.addEventListener(
        "pointerup",
        finishJituantuanDrag
    );


    document.addEventListener(
        "pointercancel",
        cancelJituantuanDrag
    );

}


// 图片跟随鼠标或手指

function moveJituantuanDragImage(event) {

    if (!currentJituantuanDragImage) {
        return;
    }


    if (
        currentJituantuanPointerId !== null &&
        event.pointerId !==
        currentJituantuanPointerId
    ) {

        return;

    }


    event.preventDefault();


    currentJituantuanDragImage.style.left =
        event.clientX + "px";


    currentJituantuanDragImage.style.top =
        event.clientY + "px";

}


// 结束拖动

function finishJituantuanDrag(event) {

    if (!currentJituantuanDragImage) {
        return;
    }


    const draggedImage =
        currentJituantuanDragImage;


    const part =
        draggedImage.dataset.part;


    const parentTool =
        draggedImage.closest(
            ".jituantuan-drag-tool"
        );


    const targetMap = {

        crest:
            "jituantuanCrestTarget",

        face:
            "jituantuanFaceTarget",

        wings:
            "jituantuanWingsTarget"

    };


    const target =
        document.getElementById(
            targetMap[part]
        );


    const isCorrect =
        isPointerInsideTarget(
            event.clientX,
            event.clientY,
            target
        );


    clearJituantuanDragState();


    if (isCorrect) {

        completeJituantuanPart(
            part,
            parentTool
        );

    } else {

        const message =
            document.getElementById(
                "jituantuanDecorMessage"
            );


        if (message) {

            message.textContent =
                "位置还不正确，请把图片拖到闪烁区域。";

        }

    }

}


// 中断拖动

function cancelJituantuanDrag() {

    if (!currentJituantuanDragImage) {
        return;
    }


    clearJituantuanDragState();

}


// 清除拖动状态

function clearJituantuanDragState() {

    if (currentJituantuanDragImage) {

        currentJituantuanDragImage
            .classList.remove(
                "dragging"
            );


        currentJituantuanDragImage
            .style.left = "";


        currentJituantuanDragImage
            .style.top = "";

    }


    currentJituantuanDragImage = null;

    currentJituantuanPointerId = null;


    document.removeEventListener(
        "pointermove",
        moveJituantuanDragImage
    );


    document.removeEventListener(
        "pointerup",
        finishJituantuanDrag
    );


    document.removeEventListener(
        "pointercancel",
        cancelJituantuanDrag
    );

}


// 判断释放点是否进入目标区域

function isPointerInsideTarget(
    pointerX,
    pointerY,
    target
) {

    if (!target) {
        return false;
    }


    const rect =
        target.getBoundingClientRect();


    return (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom
    );

}


// 检查释放位置

function isPointerInsideTarget(
    pointerX,
    pointerY,
    target
) {

    if (!target) {
        return false;
    }


    const rect =
        target.getBoundingClientRect();


    return (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom
    );

}


// 拖对后的图片替换

function completeJituantuanPart(
    part,
    tool
) {

    const stageImage =
        document.getElementById(
            "jituantuanDecorImage"
        );


    tool.classList.remove(
        "active-tool"
    );

    tool.classList.add(
        "completed-tool"
    );


    if (part === "crest") {

       stageImage.style.visibility =
    "hidden";

stageImage.src =
    "images/jituantuan-after-crest.png";

stageImage.style.visibility =
    "visible";
stageImage.classList.remove(
    "after-face-size"
);

stageImage.classList.add(
    "after-crest-size"
);
        document.getElementById(
            "jituantuanCrestTarget"
        ).classList.remove(
            "active-target"
        );


        unlockJituantuanTool(
            "jituantuanFaceTool",
            "jituantuanFaceTarget"
        );


        document.getElementById(
            "jituantuanDecorMessage"
        ).textContent =
            "鸡冠安装完成，请拖动五官到冀团团脸部。";


        jituantuanDecorStep = 1;

        return;

    }


    if (part === "face") {

        stageImage.style.visibility =
    "hidden";

stageImage.src =
    "images/jituantuan-after-face.png";

stageImage.style.visibility =
    "visible";

stageImage.classList.remove(
    "after-crest-size"
);

stageImage.classList.add(
    "after-face-size"
);
        document.getElementById(
            "jituantuanFaceTarget"
        ).classList.remove(
            "active-target"
        );


        unlockJituantuanTool(
            "jituantuanWingsTool",
            "jituantuanWingsTarget"
        );


        document.getElementById(
            "jituantuanDecorMessage"
        ).textContent =
            "五官完成，请拖动左右翅膀到身体两侧。";


        jituantuanDecorStep = 2;

        return;

    }


    if (part === "wings") {

        stageImage.style.visibility =
    "hidden";

stageImage.src =
    "images/jituantuan-main.png";

stageImage.style.visibility =
    "visible";
stageImage.classList.remove(
    "after-crest-size",
    "after-face-size"
);

        document.getElementById(
            "jituantuanWingsTarget"
        ).classList.remove(
            "active-target"
        );


        document.getElementById(
            "finishJituantuanDecorButton"
        ).disabled = false;


        document.getElementById(
            "jituantuanDecorMessage"
        ).textContent =
            "冀团团面鸡装饰完成！";


        document.getElementById(
            "rabbitScoreText"
        ).textContent = "80";


        jituantuanDecorStep = 3;

    }

}


// 解锁下一件工具

function unlockJituantuanTool(
    toolId,
    targetId
) {

    const tool =
        document.getElementById(toolId);


    const target =
        document.getElementById(targetId);


    tool.classList.remove(
        "locked-tool"
    );

    tool.classList.add(
        "active-tool"
    );


    target.classList.add(
        "active-target"
    );

}
if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupJituantuanDragTools
    );

} else {

    setupJituantuanDragTools();

}