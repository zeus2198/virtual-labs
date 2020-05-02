const typeSpeed = 40;
var typeTarget = $("#typer"), tWrapper = $("#toast-wrapper"), ti = 0, utter, timerId = -1, sWrapper, controls, lastScene = -1;
var currScene = 0;
function randEx(min, max) {
    return Math.random() * (max - min + 1) + min;
}
function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img/>')[0].src = this;
    });
}
function type(txt, cur = 0) {
    if (cur == txt.length) {
        timerId = -1;
        return;
    }
    if (cur == 0) {
        typeTarget.html("");
        clearTimeout(timerId);
    }
    typeTarget.append(txt.charAt(cur));
    timerId = setTimeout(type, typeSpeed, txt, cur + 1);
}
function ttsInit() {
    var available_voices = window.speechSynthesis.getVoices();
    var english_voice = '';
    for (var i = 0; i < available_voices.length; i++) {
        if (available_voices[i].lang === 'en-US') {
            english_voice = available_voices[i];
            break;
        }
    }
    if (english_voice === '')
        english_voice = available_voices[0];
    utter = new SpeechSynthesisUtterance();
    utter.rate = 1;
    utter.pitch = 0.5;
    utter.voice = english_voice;
}

if (window.speechSynthesis.getVoices().length == 0) {
    window.speechSynthesis.addEventListener('voiceschanged', ttsInit);
}
else ttsInit();

function tts(text) {
    // return;
    utter.text = text;
    window.speechSynthesis.speak(utter);
}
function showToast(msg, type = 0) {
    tWrapper.append(`<div id="t${ti++}" class="toast${type == 1 ? ' danger' : (type == 2 ? ' success' : '')}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="${type == 1 ? '#ff0000' : (type == 2 ? '#31a66a' : '#007aff')}" /></svg>
            <strong class="mr-auto">Notification</strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            ${msg}
    </div>
    </div>`);
    $(`#t${ti - 1}`).toast({
        delay: 5500
    });
    $(`#t${ti - 1}`).toast('show');
}
function makeLabel(txt, layer, x, y) {
    var simpleLabel = new Konva.Label({
        x: x,
        y: y,
        opacity: 0.8
    });

    simpleLabel.add(
        new Konva.Tag({
            fill: '#fed86f'
        })
    );
    simpleLabel.add(
        new Konva.Text({
            text: txt,
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: '#885c30'
        })
    );
    layer.add(simpleLabel);
    return simpleLabel;
}
function scene1() {
    const gravity = 9.8;
    var matPicked = false, uSonic = false, dPicked = false, alPicked = false, firstDropNotif = true, firstUltraNotice = true;
    var particles = [], s1anim, alDensity = 0;
    type("First step is to disperse the material into the alcohol, to do this pick the material by clicking onto the material");

    matPicked = uSonic = dPicked = false;
    var stage = new Konva.Stage({
        container: 'can1-container',
        width: $("#can1-container").width() - 14,
        height: 500
    });
    var stagew = stage.width(), stageh = stage.height()
    var slayer = new Konva.Layer();

    var grid = new Konva.Ellipse({
        x: stagew * 0.9,
        y: stageh / 2,
        radiusX: 70,
        radiusY: 20,
        fill: 'brown',
    });
    grid.listening(false);
    slayer.add(grid);

    var beaker = new Konva.Rect({
        x: (stagew / 2) - 75,
        y: (stageh / 2) - 100,
        width: 150,
        height: 200,
        stroke: 'black',
        strokeWidth: 1
    });
    // beaker.listening(false);
    slayer.add(beaker);

    var beakerTop = new Konva.Rect({
        x: (stagew / 2) - 77,
        y: (stageh / 2) - 102,
        width: 154,
        height: 4,
        fill: 'white',
    });
    beakerTop.listening(false);
    slayer.add(beakerTop);

    var alcohol = new Konva.Rect({
        x: (stagew / 2) - 75,
        y: (stageh / 2) - 100 + 50,
        width: 150,
        height: 150,
        fill: '#00ffff',
        opacity: 0.3
    });
    slayer.add(alcohol);
    var alcoholx1 = alcohol.x(), alcoholx2 = alcohol.x() + alcohol.width(),
        alcoholy1 = alcohol.y(), alcoholy2 = alcohol.y() + alcohol.height();
    alcohol.listening(false);

    var materialPick = new Konva.Rect({
        x: 10,
        y: (stageh / 2) - 150,
        width: 150,
        height: 150,
        fill: '#ee1234',
    });
    slayer.add(materialPick);

    materialPick.on('click', function (e) {
        e.cancelBubble = true;
        document.body.style.cursor = 'grab';
        matPicked = true;
        uSonic = dPicked = alPicked = false;
        showToast("Material picked, click on screen to release the material");
        tts("Material has been picked, click on white area to disperse the material");
        type("Click on white area to disperse the material and drop it into alcohol");
    })

    var matText = new Konva.Text({
        x: 90,
        y: (stageh / 2) - 100,
        width: 140,
        height: 150,
        text: 'Pick Material',
        fontSize: 25,
        fontFamily: 'Calibri',
        fill: 'White'
    });
    matText.offsetX(matText.width() / 2);
    matText.listening(false);
    slayer.add(matText);

    var dropperPick = new Konva.Rect({
        x: stagew / 2 - 75,
        y: (stageh / 2) + 170,
        width: 150,
        height: 40,
        fill: '#ee1234',
    });
    slayer.add(dropperPick);

    dropperPick.on('click', function (e) {
        e.cancelBubble = true;
        document.body.style.cursor = "url('./img/dropper.png'), grab";
        dPicked = true;
        matPicked = uSonic = alPicked = false;

    });

    var dropperText = new Konva.Text({
        x: stagew / 2 + 10,
        y: (stageh / 2) + 180,
        width: 120,
        height: 150,
        text: 'Pick dropper',
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'White'
    });
    dropperText.offsetX(dropperText.width() / 2);
    dropperText.listening(false);
    slayer.add(dropperText);

    var usonicPick = new Konva.Rect({
        x: 10,
        y: (stageh / 2) + 50,
        width: 150,
        height: 150,
        fill: '#ee1234',
    });
    slayer.add(usonicPick);

    usonicPick.on('click', function (e) {
        e.cancelBubble = true;
        document.body.style.cursor = 'grab';
        uSonic = true;
        matPicked = dPicked = alPicked = false;
        showToast("Ultrasonic machine equiped, click on screen to release the ultrasonic waves");
        tts("Ultrasonic machine has been equiped, click on white area to release the ultrasonic waves");
        type("Click on white area to release the ultrasonic waves, release the waves in alcohol to distribute the powder material evenly in it");
    });

    var usonicText = new Konva.Text({
        x: 105,
        y: (stageh / 2) + 100,
        width: 140,
        height: 150,
        text: 'Ultrasonic',
        fontSize: 25,
        fontFamily: 'Calibri',
        fill: 'white'
    });
    usonicText.offsetX(usonicText.width() / 2);
    usonicText.listening(false);
    slayer.add(usonicText);

    // ============= LABELS :
    makeLabel("Alcohol", slayer, stagew / 2 - 35, alcoholy2 + 20);
    makeLabel("Carbon Grid", slayer, grid.x() - 45, grid.y() + grid.height() + 10);

    stage.add(slayer);
    slayer.draw();

    var dlayer = new Konva.Layer();
    stage.add(dlayer);

    var particle = new Konva.Rect({
        x: stage.width() / 2,
        y: stage.height() / 2,
        width: 3,
        height: 3,
        fill: 'red'
    });
    particle.cache();

    dlayer.draw();

    s1anim = new Konva.Animation(function (frame) {
        var timeDiff = frame.timeDiff, i;
        var speedI = (gravity * timeDiff) / 1000,
            speedIW = ((gravity - 4) * timeDiff) / 1000, py, px, ax, ay;
        for (i = particles.length - 1; i >= 0; i--) {
            px = particles[i].x();
            py = particles[i].y();
            if (py > stageh) {
                particles[i].destroy();
                particles.splice(i, 1);
            }
            else if (particles[i].stopped) {
                if (particles[i].tweenFinish) {
                    // particle dispersing after ultra sonic:
                    ax = px + particles[i].velx, ay = py + particles[i].vely;
                    if (ax >= alcoholx2-3 || ax <= alcoholx1+3)
                        particles[i].velx = -particles[i].velx;
                    if (ay >= alcoholy2-2 || ay <= alcoholy1+2)
                        particles[i].vely = -particles[i].vely;
                    particles[i].position({
                        x: px + particles[i].velx,
                        y: py + particles[i].vely
                    });
                }
            }
            else {
                //particle has not been stopped
                //check if particle is in alcohol:
                if (px >= alcoholx1 + 4 && px <= alcoholx2 - 4 && py >= alcoholy1) {
                    if (py < alcoholy2 - 3) {
                        if (!particles[i].inAlcohol) {
                            // first time entering
                            if (particles[i].isAlcohol) {
                                // alcohol dropped from dropper in alcohol
                                particles[i].destroy();
                                particles.splice(i, 1);
                                continue;
                            }
                            particles[i].inAlcohol = true;
                            particles[i].vely -= 2.9;
                            particles[i].velx = particles[i].velx >= 0.2 ? particles[i].velx - 0.2 : (particles[i].velx <= -0.2 ? particles[i].velx + 0.2 : 0);
                        }
                        particles[i].vely += speedIW;
                        particles[i].position({
                            x: px + particles[i].velx,
                            y: py + particles[i].vely
                        });
                        if (py + particles[i].vely > alcoholy2) {
                            particles[i].y(alcoholy2 - 3);
                            particles[i].stopped = true;
                            if (firstDropNotif) {
                                firstDropNotif = false;
                                showToast("Material dropped successfully");
                                tts("Now equip yourself with ultrasonic machine");
                                type("Click on ultrasonic button to equip the ultrasonic machine");
                            }
                        }
                    }
                    else {
                        particles[i].y(alcoholy2 - 3);
                        particles[i].stopped = true;
                    }
                }
                else if (particles[i].isAlcohol && px >= grid.x() - grid.width() / 2 && px <= grid.x() + grid.width() / 2 && py >= grid.y() && py <= grid.y() + grid.height()) {
                    // check dropper's drop is colliding with grid

                    particles[i].destroy();
                    particles.splice(i, 1);
                    if (alDensity < 20) {
                        showToast("Alcohol has very less material particles, drop more powder in alcohol and mix them properly", 1);
                        tts("Mix more material particles in alcohol and then drop it on gird");
                    }
                    else {
                        showToast("After alcohol evaporation, grid will be ready for analysis", 2);
                        tts("After alcohol evaporation, grid will be ready for analysis");
                        type("After alcohol evaporation, grid will be ready for analysis");
                    }
                }
                else {
                    //not in alcohol
                    particles[i].vely += speedI;
                    particles[i].position({
                        x: px + particles[i].velx,
                        y: py + particles[i].vely
                    })
                }

            }

        }
    }, dlayer);

    s1anim.start();


    stage.on('click', function () {
        var mousePos = stage.getPointerPosition(), p;
        if (matPicked)
            for (let i = 0; i < 10; i++) {
                p = particle.clone({
                    x: mousePos.x + randEx(-2 - i, 2 + i),
                    y: mousePos.y - 12 + randEx(-5, 5)
                })
                p.velx = (Math.random() * 2) - 1;
                p.vely = -2;
                p.isAlcohol = false;
                p.inAlcohol = p.stopped = p.tweenFinish = false;
                p.listening(false);
                particles.push(p);
                dlayer.add(p);
            }
        else if (uSonic) {
            for (let i = 0; i < 3; i++) {
                var wedge1 = new Konva.Wedge({
                    x: mousePos.x,
                    y: mousePos.y,
                    radius: 30,
                    angle: 40,
                    fillLinearGradientStartPoint: { x: -50, y: -50 },
                    fillLinearGradientEndPoint: { x: 50, y: 50 },
                    fillLinearGradientColorStops: [0, '#29b830', 1, 'white'],
                    rotation: 120 * i
                });
                dlayer.add(wedge1);
                wedge1.tween = new Konva.Tween({
                    node: wedge1,
                    scaleX: 3,
                    scaleY: 3,
                    opacity: 0,
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    onFinish: function () {
                        wedge1.destroy();
                    }
                });
                wedge1.tween.play();
            }
            if (mousePos.y >= alcoholy1 && mousePos.y <= alcoholy2 && mousePos.x >= alcoholx1 && mousePos.x <= alcoholx2) {
                alDensity = particles.length;
                for (let i = 0; i < alDensity; i++) {
                    if (!particles[i].stopped)
                        continue;
                    particles[i].tween = new Konva.Tween({
                        node: particles[i],
                        y: randEx(alcoholy1+3, alcoholy2-3),
                        duration: 0.8,
                        easing: Konva.Easings.BounceEaseInOut,
                        onFinish: function () {
                            particles[i].vely = randEx(-2, 0.01) / 20;
                            particles[i].velx = randEx(-2, 2) / 20;
                            particles[i].tweenFinish = true;
                        }
                    });
                    particles[i].tween.play();
                }
                if (firstUltraNotice) {
                    firstUltraNotice = false;
                    showToast("Material dispersed");
                    tts("Now pick up the alcohol with dropper and drop it into grid");
                    type("Click on 'Pick dropper' button to equip dropper and then click on alcohol to fill dropper with alcohol, after that click on white area to drop the alcohol and drop it on control grid");
                }
            }

        }
        else if (dPicked) {
            if (mousePos.y >= alcoholy1 && mousePos.y <= alcoholy2 && mousePos.x >= alcoholx1 && mousePos.x <= alcoholx2) {
                alPicked = true;
                showToast("Alcohol successfully taken inside dropper");
                tts("Good, now drop the alcohol on the grid");
                type("Now drop the alcohol on the control grid. You can drop alcohol by clicking on screen");
            }
            else if (alPicked) {
                var drop = new Konva.RegularPolygon({
                    x: mousePos.x,
                    y: mousePos.y,
                    sides: 3,
                    radius: 2,
                    fill: '#61daff',
                    stroke: '#61daff',
                    strokeWidth: 5,
                    lineJoin: 'round',
                    rotation: 180
                });
                drop.isAlcohol = true;
                drop.inAlcohol = drop.stopped = drop.tweenFinish = false;
                drop.vely = 0;
                drop.velx = 0;
                drop.listening(false);
                particles.push(drop);
                dlayer.add(drop);
            }
        }
        dlayer.draw();
    });
    $("#can1-container").mouseout(function () {
        document.body.style.cursor = 'default';
        matPicked = uSonic = dPicked = false;
    })

}
function scene2() {
    type("First step is to cut the metal into thin slice of 80-100nm, use the cutter to cut the metal into thin slice of 80-100nm. Hint: After clicking on cutter, move your mouse over the metal sample and click to cut it.");
    tts("Cut the material into thin slice of 80-100 nano meter. Read instructions for hint.");
    var cPicked = false, validCut = false, punch = false, punched = false, punchedHole, epolish = false, epolished = false, surface = Array(5);
    $("#cutter, #punch, #epolish, #spolish").attr("disabled", false);
    var stage2 = new Konva.Stage({
        container: 'can2-container',
        width: $("#can2-container").width() - 14,
        height: 500
    });
    var stagew = stage2.width(), stageh = stage2.height()
    var slayer = new Konva.Layer(), dlayer = new Konva.Layer();

    var sample = new Konva.Rect({
        x: 10,
        y: stageh / 2 - 50,
        width: 320,
        height: 100,
        fill: '#eb4034',
        opacity: 0.5
    });
    slayer.add(sample);
    var samLabel = makeLabel("Bulk Metal sample", slayer, 100, stageh / 2 + 60);

    var sampleCut = new Konva.Rect({
        x: 10,
        y: stageh / 2 - 50,
        width: 220,
        height: 100,
        fill: '#eb4034',
        opacity: 0
    });
    sampleCut.listening(false);
    slayer.add(sampleCut);
    var cutLine = new Konva.Line({
        points: [],
        stroke: 'green',
        strokeWidth: 2,
        lineJoin: 'round',
        opacity: 0
    });
    dlayer.add(cutLine);
    var lengthLabel = makeLabel("100nm", dlayer, 0, 0);
    lengthLabel.opacity(0);

    var lengthLabel2 = makeLabel("100nm", dlayer, 0, 0);
    lengthLabel2.opacity(0);

    var punchHole = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 50,
        fill: 'white',
        opacity: 0
    });
    punchHole.offsetX(-punchHole.width() / 2);
    punchHole.offsetY(-punchHole.height() / 2);
    dlayer.add(punchHole);
    sample.on('mouseenter', function () {
        if (cPicked) {
            cutLine.opacity(1);
            lengthLabel.opacity(1);
            lengthLabel2.opacity(1);
        }
        else if (punch) {
            punchHole.opacity(0.5);
        }
    });
    var electron = new Konva.Rect({
        x: 0,
        y: 0,
        width: 3,
        height: 3,
        fill: '#fcba03'
    });
    electron.cache();
    sample.on('mouseleave', function () {
        cutLine.opacity(0);
        lengthLabel.opacity(0);
        lengthLabel2.opacity(0);
        if (!punched) punchHole.opacity(0);
        dlayer.draw();
    });
    sample.on('mousemove', function () {
        if (cPicked) {
            var mousePos = stage2.getPointerPosition();
            cutLine.points([mousePos.x, sample.y(), mousePos.x, sample.y() + sample.height()])
            lengthLabel.x(
                (sample.x() + mousePos.x) / 2 - 40
            )
            lengthLabel2.x(
                (sample.x() + sample.width() + mousePos.x) / 2 - 40
            )
            lengthLabel.y(sample.y() - 40);
            lengthLabel2.y(sample.y() - 40);
            lengthLabel.getText().text(Math.round(mousePos.x - sample.x()) + "nm")
            lengthLabel2.getText().text(Math.round(sample.x() + sample.width() - mousePos.x) + "nm")
            dlayer.draw();
        }
        else if (punch) {
            var mousePos = stage2.getPointerPosition();
            punchHole.x(mousePos.x);
            punchHole.y(mousePos.y);
            dlayer.draw();
        }
    });
    stage2.on('click', function () {
        var mousePos = stage2.getPointerPosition();
        if (mousePos.x >= sample.x() && mousePos.x <= sample.x() + sample.width() && mousePos.y >= sample.y() && mousePos.y <= sample.y() + sample.height()) {
            if (cPicked) {
                var cutWidth = mousePos.x - sample.x();
                var cutWidth2 = sample.x() + sample.width() - mousePos.x;

                if (cutWidth >= 80 && cutWidth <= 100) {
                    sampleCut.opacity(1);
                    sampleCut.width(cutWidth);
                    showToast("Material cut successfully in valid dimension", 2), validCut = true;
                    type("Now you need cut out a disk from the slice using punch tool");
                    tts("Great! Now you need to cut out a disk using punch tool");
                }
                else if (cutWidth2 >= 80 && cutWidth2 <= 100) {
                    sampleCut.opacity(1);
                    sampleCut.width(cutWidth2);
                    sampleCut.x(mousePos.x);
                    showToast("Material cut successfully in valid dimension", 2), validCut = true;
                    type("Now you need cut out a disk from the slice using punch tool");
                    tts("Great! Now you need to cut out a disk using punch tool");
                }
                else
                    showToast("Material cut is not of proper width, retry.", 1), validCut = false;
                slayer.draw();
            }
            else if (punch) {
                if (mousePos.x > sample.x() + sample.width() - punchHole.width())
                    showToast("Punch hole out of bounds", 1);
                else if (mousePos.y > sample.y() + sample.height() - punchHole.height())
                    showToast("Punch hole out of bounds", 1);
                else {
                    punch = false;
                    setTimeout(function () {
                        punchHole.opacity(1);
                        punchHole.stroke('black');
                        punchHole.strokeWidth(2);
                        dlayer.draw();
                        punched = true;
                        document.body.style.cursor = 'default';
                        punchedHole = punchHole.clone();
                        dlayer.add(punchedHole);
                        punchedHole.fill("#eb4034");
                        punchedHole.to({
                            duration: 1,
                            x: punchHole.x() + sample.width() + 70,
                            onFinish: function () {
                                showToast("Hole punched successfully", 2);
                            }
                        });
                        type("Next step is to electro polish the obtained disk");
                        tts("Great! Now electropolish the disk");

                    }, 10);
                }
            }
        }
    });
    stage2.add(slayer);
    stage2.add(dlayer);
    $("#can2-container").mouseout(function () {
        document.body.style.cursor = 'default';
    });
    $("#can2-container").mouseover(function () {
        if (cPicked)
            document.body.style.cursor = 'url(./img/cutter.png), grab';
        else if (punch)
            document.body.style.cursor = 'url(./img/punch.png), grab';
    });
    $("#cutter").click(function () {
        showToast("Cutter picked successfully");
        cPicked = true;
    });
    $("#punch").click(function () {
        if (!validCut)
            return showToast("Cut the material into thin slice first");
        if (punched)
            return showToast("Hole already punched");
        type("Hover over the sample, and click to cut out a disk, the punch tool is set to cut a disk of 3mm.");
        tts("Cut out a disk of 3mm");
        $("#cutter").attr("disabled", true);
        cPicked = false;
        sampleCut.to({
            duration: 1,
            width: 150,
            height: 150,
            x: 90,
            y: sample.y() - 30
        });
        sample.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                sample.width(150);
                sample.height(150);
                sample.x(90);
                sample.y(sample.y() - 30);
                sample.opacity(1);
                sampleCut.destroy();
            }
        });
        samLabel.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                samLabel.x(70);
                samLabel.y(samLabel.y() + 40);
                samLabel.getText().text("Cross sectional view of slice");
                samLabel.to({
                    duration: 1,
                    opacity: 1,
                });
            }
        });
        lengthLabel.destroy();
        lengthLabel2.destroy();
        punch = true;
    });
    $("#epolish").click(function () {
        if (epolish)
            return;
        if (!punched)
            return showToast("You need to obtain a disc by punching before electropolishing it!");
        $("#punch").attr("disabled", true);
        epolish = true;
        type("Electropolishing is done to smoothen the surface, click on 'Start Electropolish' button to start the electropolish process.");
        sample.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                sample.width(40);
                sample.height(200);
                sample.x(70);
                sample.y(stageh / 2 - 100);
                for (let i = 0; i < 5; i++) {
                    surface[i] = new Konva.Rect({
                        x: 100,
                        y: sample.y() + i * 33 + randEx(0, 10),
                        width: 30 + randEx(0, 15),
                        height: 30 + randEx(0, 15),
                        fill: '#eb4034',
                        rotation: 45,
                        opacity: 0
                    });
                    dlayer.add(surface[i]);
                    surface[i].to({
                        duration: 1,
                        opacity: 1
                    });
                }
                // dlayer.draw();
                sample.to({
                    duration: 1,
                    opacity: 1,
                });
                Konva.Image.fromURL('./img/epolish.jpg', function (epolishImg) {
                    epolishImg.setAttrs({
                        x: stagew - epolishImg.width() - 10,
                        y: 10
                    });
                    slayer.add(epolishImg);
                    slayer.batchDraw();
                });
            }
        });
        punchHole.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                punchHole.destroy();
            }
        });
        punchedHole.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                punchedHole.destroy();
            }
        });
        samLabel.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                samLabel.x(70);
                samLabel.y(stageh / 2 + 100 + 30);
                samLabel.getText().text("Surface");
                samLabel.to({
                    duration: 1,
                    opacity: 1,
                });
            }
        });

    });
    $("#spolish").click(function () {
        if (!epolish)
            return showToast("Switch to electropolishing mode first");
        $("#epolish, #spolish").attr("disabled", true);
        type("Observe the surface carefully to see the effect of electropolishing");
        tts("Observe the surface carefully to see the effect of electropolishing");
        var p;
        for (let i = 0; i < 40; i++) {
            p = electron.clone({
                x: sample.x() + 10,
                y: sample.y() + 10 + randEx(-10, 10) + (i * 200 / 40)
            })
            p.listening(false);
            dlayer.add(p);
            p.to({
                duration: randEx(0.1, 1),
                x: p.x() + 150 + randEx(-10, 10),
                y: p.y() + randEx(-10, 10),
                opacity: 0,
                easing: Konva.Easings.StrongEaseOut,
                onFinish: function () {
                    p.destroy();
                }
            });
        }
        var c = 0;
        var eTimer = setInterval(function () {
            for (let i = 0; i < 40; i++) {
                p = electron.clone({
                    x: sample.x() + 10,
                    y: sample.y() + 10 + randEx(-10, 10) + (i * 200 / 40)
                })
                p.listening(false);
                dlayer.add(p);
                p.to({
                    duration: randEx(0.1, 1),
                    x: p.x() + 150 + randEx(-10, 10),
                    y: p.y() + randEx(-10, 10),
                    opacity: 0,
                    easing: Konva.Easings.StrongEaseOut,
                    onFinish: function () {
                        p.destroy();
                    }
                });
            }
            c++;
            if (c == 65) {
                clearInterval(eTimer);
                showToast("Electro polishing finished, look at the surface now.", 2);
                type("The last step is to dry and wash the specimen");
                tts("Now dry and wash the specimen.");
                epolished = true;
            }

        }, 200);
        for (let i = 0; i < 5; i++) {
            surface[i].to({
                duration: 25,
                cornerRadius: 70
            });
        }
    });
    $("#wash").click(function () {
        if (!epolished)
            return showToast("Electro polish the disk completetly first");
        type("This is the last step, specimen is now ready for analysis under TEM");
        tts("Specimen is now ready for analysis under TEM");
        showToast("Specimen ready for analysis", 2);
    });
    slayer.draw();
    dlayer.draw();
}
function scene3() {
    type("First step is to cut the metal into thin slice of 80-100nm, use the cutter to cut the metal into thin slice of 80-100nm. Hint: After clicking on cutter, move your mouse over the metal sample and click to cut it.");
    tts("Cut the material into thin slice of 80-100 nano meter. Read instructions for hint.");
    var cPicked = false, validCut = false, punch = false, punched = false, punchedHole, epolish = false, epolished = false, surface = Array(5), img, mil = false;
    $("#cutter2, #punch2, #epolish2, #spolish2").attr("disabled", false);
    var stage2 = new Konva.Stage({
        container: 'can3-container',
        width: $("#can3-container").width() - 14,
        height: 500
    });
    var stagew = stage2.width(), stageh = stage2.height()
    var slayer = new Konva.Layer(), dlayer = new Konva.Layer();

    var sample = new Konva.Rect({
        x: 10,
        y: stageh / 2 - 50,
        width: 320,
        height: 100,
        fill: '#eb4034',
        opacity: 0.5
    });
    slayer.add(sample);
    var samLabel = makeLabel("Bulk Metal sample", slayer, 100, stageh / 2 + 60);

    var sampleCut = new Konva.Rect({
        x: 10,
        y: stageh / 2 - 50,
        width: 220,
        height: 100,
        fill: '#eb4034',
        opacity: 0
    });
    sampleCut.listening(false);
    slayer.add(sampleCut);
    var cutLine = new Konva.Line({
        points: [],
        stroke: 'green',
        strokeWidth: 2,
        lineJoin: 'round',
        opacity: 0
    });
    dlayer.add(cutLine);
    var lengthLabel = makeLabel("100nm", dlayer, 0, 0);
    lengthLabel.opacity(0);

    var lengthLabel2 = makeLabel("100nm", dlayer, 0, 0);
    lengthLabel2.opacity(0);

    var punchHole = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 50,
        fill: 'white',
        opacity: 0
    });
    punchHole.offsetX(-punchHole.width() / 2);
    punchHole.offsetY(-punchHole.height() / 2);
    dlayer.add(punchHole);

    var electron = new Konva.Rect({
        x: 0,
        y: 0,
        width: 3,
        height: 3,
        fill: '#fcba03'
    });
    electron.cache();

    sample.on('mouseenter', function () {
        if (cPicked) {
            cutLine.opacity(1);
            lengthLabel.opacity(1);
            lengthLabel2.opacity(1);
        }
        else if (punch) {
            punchHole.opacity(0.5);
        }
    });
    sample.on('mouseleave', function () {
        cutLine.opacity(0);
        lengthLabel.opacity(0);
        lengthLabel2.opacity(0);
        if (!punched) punchHole.opacity(0);
        dlayer.draw();
    });
    sample.on('mousemove', function () {
        if (cPicked) {
            var mousePos = stage2.getPointerPosition();
            cutLine.points([mousePos.x, sample.y(), mousePos.x, sample.y() + sample.height()])
            lengthLabel.x(
                (sample.x() + mousePos.x) / 2 - 40
            )
            lengthLabel2.x(
                (sample.x() + sample.width() + mousePos.x) / 2 - 40
            )
            lengthLabel.y(sample.y() - 40);
            lengthLabel2.y(sample.y() - 40);
            lengthLabel.getText().text(Math.round(mousePos.x - sample.x()) + "nm")
            lengthLabel2.getText().text(Math.round(sample.x() + sample.width() - mousePos.x) + "nm")
            dlayer.draw();
        }
        else if (punch) {
            var mousePos = stage2.getPointerPosition();
            punchHole.x(mousePos.x);
            punchHole.y(mousePos.y);
            dlayer.draw();
        }
    });
    stage2.on('click', function () {
        var mousePos = stage2.getPointerPosition();
        if (mousePos.x >= sample.x() && mousePos.x <= sample.x() + sample.width() && mousePos.y >= sample.y() && mousePos.y <= sample.y() + sample.height()) {
            if (cPicked) {
                var cutWidth = mousePos.x - sample.x();
                var cutWidth2 = sample.x() + sample.width() - mousePos.x;

                if (cutWidth >= 80 && cutWidth <= 100) {
                    sampleCut.opacity(1);
                    sampleCut.width(cutWidth);
                    showToast("Material cut successfully in valid dimension", 2), validCut = true;
                    type("Now you need cut out a disk from the slice using punch tool");
                    tts("Great! Now you need to cut out a disk using punch tool");
                }
                else if (cutWidth2 >= 80 && cutWidth2 <= 100) {
                    sampleCut.opacity(1);
                    sampleCut.width(cutWidth2);
                    sampleCut.x(mousePos.x);
                    showToast("Material cut successfully in valid dimension", 2), validCut = true;
                    type("Now you need cut out a disk from the slice using punch tool");
                    tts("Great! Now you need to cut out a disk using punch tool");
                }
                else
                    showToast("Material cut is not of proper width, retry.", 1), validCut = false;
                slayer.draw();
            }
            else if (punch) {
                if (mousePos.x > sample.x() + sample.width() - punchHole.width())
                    showToast("Punch hole out of bounds", 1);
                else if (mousePos.y > sample.y() + sample.height() - punchHole.height())
                    showToast("Punch hole out of bounds", 1);
                else {
                    punch = false;
                    setTimeout(function () {
                        punchHole.opacity(1);
                        punchHole.stroke('black');
                        punchHole.strokeWidth(2);
                        dlayer.draw();
                        punched = true;
                        document.body.style.cursor = 'default';
                        punchedHole = punchHole.clone();
                        dlayer.add(punchedHole);
                        punchedHole.fill("#eb4034");
                        punchedHole.to({
                            duration: 1,
                            x: punchHole.x() + sample.width() + 70,
                            onFinish: function () {
                                showToast("Hole punched successfully", 2);
                            }
                        });
                        type("Next step is to electro polish the obtained disk");
                        tts("Great! Now electropolish the disk");

                    }, 10);
                }
            }
        }
    });
    stage2.add(slayer);
    stage2.add(dlayer);
    $("#can3-container").mouseout(function () {
        document.body.style.cursor = 'default';
    });
    $("#can3-container").mouseover(function () {
        if (cPicked)
            document.body.style.cursor = 'url(./img/cutter.png), grab';
        else if (punch)
            document.body.style.cursor = 'url(./img/punch.png), grab';
    });
    $("#cutter2").click(function () {
        showToast("Cutter picked successfully");
        cPicked = true;
    });
    $("#punch2").click(function () {
        if (!validCut)
            return showToast("Cut the material into thin slice first");
        if (punched)
            return showToast("Hole already punched");
        type("Hover over the sample, and click to cut out a disk, the punch tool is set to cut a disk of 3mm.");
        tts("Cut out a disk of 3mm");
        $("#cutter2").attr("disabled", true);
        cPicked = false;
        sampleCut.to({
            duration: 1,
            width: 150,
            height: 150,
            x: 90,
            y: sample.y() - 30
        });
        sample.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                sample.width(150);
                sample.height(150);
                sample.x(90);
                sample.y(sample.y() - 30);
                sample.opacity(1);
                sampleCut.destroy();
            }
        });
        samLabel.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                samLabel.x(70);
                samLabel.y(samLabel.y() + 40);
                samLabel.getText().text("Cross sectional view of slice");
                samLabel.to({
                    duration: 1,
                    opacity: 1,
                });
            }
        });
        punch = true;
    });
    $("#epolish2").click(function () {
        if (epolish)
            return;
        if (!punched)
            return showToast("You need to obtain a disc by punching before electropolishing it!");
        $("#punch2").attr("disabled", true);
        epolish = true;
        type("Electropolishing is done to smoothen the surface, click on 'Start Electropolish' button to start the electropolish process.");
        sample.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                sample.width(40);
                sample.height(200);
                sample.x(70);
                sample.y(stageh / 2 - 100);
                for (let i = 0; i < 5; i++) {
                    surface[i] = new Konva.Rect({
                        x: 100,
                        y: sample.y() + i * 33 + randEx(0, 10),
                        width: 30 + randEx(0, 15),
                        height: 30 + randEx(0, 15),
                        fill: '#eb4034',
                        rotation: 45,
                        opacity: 0
                    });
                    dlayer.add(surface[i]);
                    surface[i].to({
                        duration: 1,
                        opacity: 1
                    });
                }
                // dlayer.draw();
                sample.to({
                    duration: 1,
                    opacity: 1,
                });
                Konva.Image.fromURL('./img/epolish.jpg', function (epolishImg) {
                    img = epolishImg;
                    epolishImg.setAttrs({
                        x: stagew - epolishImg.width() - 10,
                        y: 10
                    });
                    slayer.add(epolishImg);
                    slayer.batchDraw();
                });
            }
        });
        punchHole.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                punchHole.destroy();
            }
        });
        punchedHole.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                punchedHole.destroy();
            }
        });
        samLabel.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                samLabel.x(70);
                samLabel.y(stageh / 2 + 100 + 30);
                samLabel.getText().text("Surface");
                samLabel.to({
                    duration: 1,
                    opacity: 1,
                });
            }
        });

    });
    $("#spolish2").click(function () {
        if (!epolish)
            return showToast("Switch to electropolishing mode first");
        $("#epolish2, #spolish2").attr("disabled", true);
        type("Observe the surface carefully to see the effect of electropolishing");
        tts("Observe the surface carefully to see the effect of electropolishing");
        var p;
        for (let i = 0; i < 40; i++) {
            p = electron.clone({
                x: sample.x() + 10,
                y: sample.y() + 10 + randEx(-10, 10) + (i * 200 / 40)
            })
            p.listening(false);
            dlayer.add(p);
            p.to({
                duration: randEx(0.1, 1),
                x: p.x() + 150 + randEx(-10, 10),
                y: p.y() + randEx(-10, 10),
                opacity: 0,
                easing: Konva.Easings.StrongEaseOut,
                onFinish: function () {
                    p.destroy();
                }
            });
        }
        var c = 0;
        var eTimer = setInterval(function () {
            for (let i = 0; i < 40; i++) {
                p = electron.clone({
                    x: sample.x() + 10,
                    y: sample.y() + 10 + randEx(-10, 10) + (i * 200 / 40)
                })
                p.listening(false);
                dlayer.add(p);
                p.to({
                    duration: randEx(0.1, 1),
                    x: p.x() + 150 + randEx(-10, 10),
                    y: p.y() + randEx(-10, 10),
                    opacity: 0,
                    easing: Konva.Easings.StrongEaseOut,
                    onFinish: function () {
                        p.destroy();
                    }
                });
            }
            c++;
            if (c == 65) {
                clearInterval(eTimer);
                showToast("Electro polishing finished, look at the surface now.", 2);
                epolished = true;
            }

        }, 200);
        for (let i = 0; i < 5; i++) {
            surface[i].to({
                duration: 25,
                cornerRadius: 70
            });
        }
    });
    $("#mil").click(function () {
        if (!epolished)
            return showToast("Electro polish the disk completetly first");
        type("This is the last thinning stage for the speicmen, here the specimen is bombarded with electrons or atoms to thin the material");
        mil = true;
        dlayer.draw();
        img.to({
            duration: 1,
            opacity: 0,
            onFinish: function () {
                img.destroy();
                Konva.Image.fromURL('./img/ion_mil.jpg', function (ionMilImg) {
                    img = ionMilImg;
                    ionMilImg.setAttrs({
                        x: stagew - ionMilImg.width() - 10,
                        y: 10
                    });
                    slayer.add(ionMilImg);
                    slayer.batchDraw();
                });
            }
        });
        for (let i = 0; i < 5; i++) {
            surface[i].x(400);
            surface[i].fill("#ffffff");
            surface[i].cornerRadius(5);
        }
        sample.x(400);
        samLabel.x(390);
    });
    $("#smil").click(function () {
        if (!mil)
            return showToast("Switch to Ion Milling mode first");
        $("#mil, #smil").attr("disabled", true);
        type("Observe the surface carefully to see the effect of Ion Milling");
        tts("Observe the surface carefully to see the effect of Ion Milling");
        c = 0;
        var eTimer = setInterval(function () {
            for (let i = 0; i < 40; i++) {
                p = electron.clone({
                    x: 260,
                    y: sample.y() + 10 + randEx(-10, 10) + (i * 200 / 40)
                })
                p.listening(false);
                dlayer.add(p);
                p.to({
                    duration: randEx(0.1, 1),
                    x: p.x() + 180 + randEx(-30, 30),
                    y: p.y() + randEx(-10, 10),
                    opacity: 0,
                    easing: Konva.Easings.StrongEaseOut,
                    onFinish: function () {
                        p.destroy();
                    }
                });
            }
            c++;
            if (c == 65) {
                clearInterval(eTimer);
                showToast("Ion Milling finished", 2);
                tts("Sample is now ready for analysis");
                type("Final step is complete, sample is now ready for analysis")
            }

        }, 200);
        for (let i = 0; i < 5; i++) {
            surface[i].to({
                duration: 20,
                cornerRadius: 90,
                width: surface[i].width() + 20,
                height: surface[i].height() + 20
            });
        }
    });
    slayer.draw();
    dlayer.draw();
}
function loadScene(ind) {
    currScene = ind;
    sWrapper.fadeOut(function () {
        if (lastScene != -1 && window[`sceneExit${lastScene}`])
            window[`sceneExit${lastScene}`]();
        lastScene = currScene;
        sWrapper.html($(`#scene${currScene}`).html());
        sWrapper.fadeIn(function () {
            if (window[`scene${currScene}`]) window[`scene${currScene}`]();
        });
    });
    controls.fadeOut(function () {
        controls.html($(`#scene-control${currScene}`).html());
        controls.fadeIn();
    });
}
$(document).ready(function () {
    // tts("Welcome to material preparation for TEM lab");
    type("Read the information in middle carefully, then select the material type to be prepared from the buttons provided in top-center of the screen");
    sWrapper = $("#s-wrapper");
    controls = $("#controls");

    // loadScene(3);

    setTimeout(function () {
        preload(['./img/dropper.png', './img/cutter.png', './img/punch.png', './img/epolish.jpg', './img/ion_mil.jpg']);
    }, 2000);
    $(".sceneBut button").click(function () {
        $(".sceneBut button").removeClass("active");
        $(this).addClass("active");
        loadScene(parseInt($(this).attr("data-scene")));
    });
});