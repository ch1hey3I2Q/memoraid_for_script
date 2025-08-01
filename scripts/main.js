let page = 0;

const allimages_folder_path = './images/compressed';
let images_folder_path;

const maskon = {"朝利":0, "板垣":0, "望月":0, "池谷":0, "生島":0, "横内":0, "ゆうき":0, "祐子":0, "+人名":0, "その他":0};
const idToname = {"asari":"朝利", "itagaki":"板垣", "mochiduki":"望月", "iketani":"池谷", "kijima":"生島", "yokouchi":"横内", "yuuki":"ゆうき", "yuuko":"祐子", "name":"+人名", "others":"その他"};

const exception = {"朝利・板垣":["朝利", "板垣"], "朝利・望月":["朝利", "望月"], "板垣・望月":["板垣", "望月"], "朝利・板垣・望月":["朝利", "板垣", "望月"], "板垣・池谷":["板垣", "池谷"], "利":["朝利"]};

const mag_width = 0.0175;
const mag_bottom = 0.561;
const mag_top = {"朝利":0.121, "利":0.110, "板垣":0.121, "望月":0.121, "池谷":0.121, "生島":0.121, "横内":0.121, "ゆうき":0.132, "祐子":0.121, "朝利・板垣":0.155, "朝利・望月":0.155, "板垣・望月":0.155, "朝利・板垣・望月":0.188, "板垣・池谷":0.155, "改行":0.107, "+人名":0.093, "その他":0.093};
const mag_left_offset = 0.1535;
const mag_left_interval = 0.01953;

const mag_uis_width = 0.050;

const class_arrowboxes = document.getElementsByClassName("arrowboxes");
const class_mask = document.getElementsByClassName("mask");

const script_img = document.getElementById("script_img");
let img_width;


function pageup () {
    if (page < 78) {
        page++;
        reload();
    }
}

function pagedown () {
    if (page > 0) {
        page--;
        reload();
    }
}

for (let i = 0; i < class_arrowboxes.length; i++) {
    class_arrowboxes[i].addEventListener('touchend', (e) => {
        e.preventDefault();
        if (i == 0) {
            pagedown();
        } else {
            pageup();
        }
    })
    
    class_arrowboxes[i].addEventListener('click', () => {
        if (i == 0) {
            pagedown();
        } else {
            pageup();
        }
    })
}

document.body.addEventListener('keydown', (e) => {
    if (main.style.display == 'block') {
        switch (e.code) {
            case 'ArrowRight':
                e.preventDefault();
                pagedown();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                pageup();
                break;
            case 'KeyR':
                reload();
                break;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
            case 'Digit9':
            case 'Digit0':
                inputpage.focus();
                break;
            case 'Enter':
                e.preventDefault();
                if (document.activeElement.id != "inputpage") {
                    if (class_mask.length > 0) {
                        class_mask[0].remove();
                    } else {
                        pageup();
                    }
                } else {
                    inputpage.blur();
                    window.scroll({top: 0});
                }
                break;
        }
    } else if (e.code == 'Enter') {
        close_tips();
    }
})

let clicked = null;
let downtime;
let islongclick = false;
script_img.addEventListener('touchstart', (e) => {
    downtime = performance.now();
    // clicked = e.target;
    setTimeout(() => {
        if (clicked != null && clicked == e.target && performance.now() - downtime >= 500) {
            islongclick = true;
            reload();
        }
    }, 500);
})


const mask_specker = document.getElementsByName("mask_specker");
for (let i = 0; i < mask_specker.length; i++) {
    mask_specker[i].addEventListener('change', (e) => {
        if (e.currentTarget.checked) {
            maskon[idToname[e.currentTarget.id]] = 1;
        } else {
            maskon[idToname[e.currentTarget.id]] = 0;
        }
        reload();
    })
}

const useimages = document.getElementsByName("useimages");
for (let i = 0; i < useimages.length; i++) {
    useimages[i].addEventListener('change', imagechange);
}

function imagechange () {
    for (let i = 0; i < useimages.length; i++) {
        if (useimages[i].checked) {
            images_folder_path = allimages_folder_path + useimages[i].value;
            break;
        }
    }
    imagereload(images_folder_path, page);
}

const inputpage = document.getElementById("inputpage");
inputpage.addEventListener('focus', inputpage.select);
inputpage.addEventListener('change', jump_page);

function jump_page () {
    if (Number(inputpage.value) < 0) {
        page = 0;
    } else if (Number(inputpage.value) > 78) {
        page = 78;
    } else if (inputpage.value != '') {
        page = Number(inputpage.value);
    } else {
        inputpage.value = page;
        return;
    }
    inputpage.blur();
    reload();
}


const onehandbtn = document.getElementById("onehand_mode");
const right_left = document.getElementById("right_left");
const onehand_uis = document.getElementById("onehand_uis");
let isonehandmode = false;
onehandbtn.addEventListener('click', () => {
    if (isonehandmode) {
        isonehandmode = false;
        onehandbtn.textContent = '片手モード';
        right_left.style.display = 'none';
        onehand_uis.style.display = 'none';
        resize();
    } else {
        isonehandmode = true;
        onehandbtn.textContent = '片手モード解除';
        right_left.style.display = 'inline-block';
        onehand_uis.style.display = 'block';
        resize();
    }
})

let onehand_rl = 'right';
const rlbtn = document.getElementById("right_left");
rlbtn.addEventListener('click', () => {
    onehand_rl = onehand_rl == 'right' ? 'left' : 'right';
    rlbtn.textContent = onehand_rl == 'right' ? '切り替え:左' : '切り替え:右';
    resize();
})

let isreloaded = false;
let ismoved = false;
const stick = document.getElementById("stick");
stick.addEventListener('touchstart', (e) => {
    // clicked = e.target;
    setTimeout(() => {
        if (clicked != null && performance.now() - downtime >= 500) {
            islongclick = true;
            if (!ismoved && class_mask.length != 0) {
                reload();
                isreloaded = true;
            }
        }
    }, 500);
})

let stick_defaultleft;
stick.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isreloaded) {
        if (!ismoved) {
            ismoved = true;
        }
        if (clicked == e.target) {
            const touch_left = pointer_x - onehand_uis.getBoundingClientRect().left;
            const max_left = stick_defaultleft + stick.clientWidth / 2;
            const min_left = stick_defaultleft - stick.clientWidth / 2;
            if (touch_left > max_left) {
                stick.style.left = max_left + 'px';
            } else if (touch_left < min_left) {
                stick.style.left = min_left + 'px';
            } else {
                stick.style.left = touch_left + 'px';
            }
        }
    }
})

stick.addEventListener('touchend', () => {
    // clicked = null;
    const move_left = stick.getBoundingClientRect().left + stick.clientWidth / 2 - onehand_uis.getBoundingClientRect().left - stick_defaultleft;
    if (move_left < stick.clientWidth / 4 * -1) {
        pageup();
    } else if (move_left > stick.clientWidth / 4) {
        pagedown();
    }
    stick.style.left = stick_defaultleft + 'px';
    islongclick = false;
    ismoved = false;
    isreloaded = false;
})

const slider = document.getElementById("slider");
function slider_reset () {
    if (class_mask.length != 0) {
        const nextmask = class_mask[0];
        slider.style.height = nextmask.getBoundingClientRect().height + 'px';
        slider.style.top = nextmask.getBoundingClientRect().top + window.scrollY + 'px';
    } else {
        slider.style.height = img_width * (mag_bottom - mag_top['+人名']) + 'px';
        slider.style.top = img_width * mag_top['+人名'] + 'px';
    }
}

const mask_event = (e) => {
    e.preventDefault();
    downtime = performance.now();
    clicked = e.target; //処理間に合わないので応急処置的に
    const target = clicked.id == "slider" 
                ? class_mask.length != 0 
                    ? class_mask[0] 
                    : clicked 
                : clicked;
    islongclick = false;
    setTimeout(() => {
        if (clicked != null && performance.now() - downtime >= 500) {
            islongclick = true;
        }
    }, 500);
    const down_x = e.type == 'touchstart' ? e.touches[0].pageX : e.pageX;
    const down_y = e.type == 'touchstart' ? e.touches[0].pageY : e.pageY;
    pointer_x = e.type == 'touchstart' ? e.touches[0].pageX : e.pageX;
    pointer_y = e.type == 'touchstart' ? e.touches[0].pageY : e.pageY;
    if (intervalid == null) {
        intervalid = setInterval(() => {
            const row = target.id.replace(/[^0-9]/g, '');
            const name = maskon["+人名"] == 1 && speaker[page][row] != "改行" 
                        ? "+人名" 
                        : speaker[page][row] != undefined 
                        ? speaker[page][row] 
                        : "その他";
            if (clicked != null) {
                if (islongclick) {
                    if (img_width * mag_top[name] >= pointer_y) {
                        target.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                        target.style.top = img_width * mag_top[name] + 'px';
                    } else if (img_width * mag_bottom <= pointer_y) {
                        target.style.height = '0px';
                    } else {
                        target.style.height = img_width * mag_bottom - pointer_y + 'px';
                        target.style.top = pointer_y + 'px';
                    }
                    if (clicked.id == 'slider') {
                        slider.style.height = target.getBoundingClientRect().height + 'px';
                        slider.style.top = target.getBoundingClientRect().top + 'px';
                    }
                } else if (pointer_x != down_x || pointer_y != down_y) {
                    islongclick = true;
                }
            } else {
                if (islongclick) {
                    target.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                    target.style.top = img_width * mag_top[name] + 'px';
                } else {
                    islongclick = false;
                    if (class_mask.length != 0) {
                        target.remove();
                    } else {
                        pageup();
                    }
                }
                clearInterval(intervalid);
                intervalid = null;
                slider_reset();                
            }
        }, 0);
    }
}

slider.addEventListener('touchstart', mask_event);
slider.addEventListener('touchmove', (e) => {
    e.preventDefault();
})


const fullscreen = document.getElementById("fullscreen");
fullscreen.addEventListener('click', () => {
    if (window.outerWidth == window.screen.width && window.outerHeight == window.screen.height) {
        // document.exitFullscreen();

        // Chrome & Firefox v64以降
        if( document.exitFullscreen ) {
          document.exitFullscreen();

        // Firefox v63以前
        } else if( document.mozCancelFullScreen ) {
          document.mozCancelFullScreen();

        // Safari & Edge & Chrome v44以前
        } else if( document.webkitCancelFullScreen ) {
          document.webkitCancelFullScreen();

        // IE11
        } else if( document.msExitFullscreen ) {
          document.msExitFullscreen();
        }
    } else {
        // document.documentElement.requestFullscreen();

        // Chrome & Firefox v64以降
        if( document.body.requestFullscreen ) {
            document.body.requestFullscreen();
          
        // Firefox v63以前
        } else if( document.body.mozRequestFullScreen ) {
            document.body.mozRequestFullScreen();

        // Safari & Edge & Chrome v68以前
        } else if( document.body.webkitRequestFullscreen ) {
            document.body.webkitRequestFullscreen();
          
        // IE11
        } else if( document.body.msRequestFullscreen ) {
            document.body.msRequestFullscreen();
        }     
    }
})


function imagereload (path, p) {
    script_img.src = path +  '/page_' + ('000' + p).slice( -3 ) + '.png';
}


function reload () {
    while (class_mask.length > 0) {
        class_mask[0].remove();
    }
    
    for (let i = 0; i < speaker[page].length; i++) {
        let speaking = speaker[page][i];
        if (speaking != undefined) {
            let back_page = 0;
            let back_row = 0;
            while (speaking == '改行') {
                back_row++;
                if (i - back_row < 0) {
                    back_row = i - 35;
                    back_page++;
                }
                speaking = speaker[page - back_page][i - back_row];
            }

            if (maskon[speaking] == undefined) {
                let union = 0;
                for (let i = 0; i < exception[speaking].length; i++) {
                    union += maskon[exception[speaking][i]];
                }
                if (union > 0) {
                    addmask(i);
                }
            } else {
                if (maskon[speaking] == 1) {
                    addmask(i);
                }
            }
        } else if (maskon["その他"] == 1) {
            addmask(i);
        }
    }

    if (isonehandmode) {
        slider_reset();
    }

    imagereload(images_folder_path, page);
    inputpage.value = page;
}

window.addEventListener('resize', () => {
    resize();
    if (window.outerWidth == window.screen.width && window.outerHeight == window.screen.height) {
        fullscreen.textContent = '全画面解除';
    } else if (document.exitFullscreen) {
        fullscreen.textContent = '全画面';
    }
})


function resize () {
    const window_width = document.querySelector('html').clientWidth;
    const window_height = document.querySelector('html').clientHeight;

    img_width = window_width / window_height <= 1920 / 1200 ? window_width : window_height /1200 * 1920;
    const img_height = window_width / window_height <= 1920 / 1200 ? window_width / 1920 * 1200 : window_height;
    script_img.style.width = img_width + 'px';
    script_img.style.height = img_height + 'px';
     
    for (let i = 0; i < class_arrowboxes.length; i++) {
        class_arrowboxes[i].style.width = img_width * mag_uis_width + 'px';
        class_arrowboxes[i].style.height = img_height + 'px';
        class_arrowboxes[i].style.top = img_height / 2 + 'px';
        class_arrowboxes[i].style.left = img_width * (-i + 1) + 'px';
    }

    for (let i = 0; i < class_mask.length; i++) {
        const row = class_mask[i].id.replace(/[^0-9]/g, '');
        const name = maskon["+人名"] == 1 && speaker[page][row] != "改行" 
                    ? "+人名" 
                    : speaker[page][row] != undefined 
                    ? speaker[page][row] 
                    : "その他";
        class_mask[i].style.width = img_width * mag_width + 'px';
        class_mask[i].style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
        class_mask[i].style.top = img_width * mag_top[name] + 'px';
        class_mask[i].style.left = img_width * mag_left_offset + img_width * mag_left_interval * (35 - row) + 'px';
    }

    main.style.width = img_width + 'px';
    main.style.height = document.documentElement.scrollHeight + 'px';

    // const options = document.getElementById("options");
    // options.style.top = img_height + 'px';

    onehand_uis.style.width = img_width * mag_uis_width * 2 + 'px';
    onehand_uis.style.height = img_height + 'px';
    onehand_uis.style.left = img_width + 'px';

    const stick_width = img_width * mag_uis_width;
    stick.style.width = stick_width + 'px';
    stick.style.top = img_width * mag_uis_width * 0.5 + 'px';
    stick.style.left = '50%';
    stick_defaultleft = stick.getBoundingClientRect().left - onehand_uis.getBoundingClientRect().left + stick_width / 2;

    slider.style.width = stick_width + 'px';
    slider_reset();

    const script_scroll = document.getElementById("script_scroll");
    script_scroll.style.width = isonehandmode ? img_width + onehand_uis.clientWidth + 'px' : img_width + 'px';
    script_scroll.style.height = img_height + 'px';

    const script = document.getElementById("script");
    if (isonehandmode) {
        script.style.width = window_width > script_scroll.clientWidth ? script_scroll.clientWidth + 'px' : window_width + 'px';
    } else if (script_scroll.clientWidth != 0) {
        script.style.width = script_scroll.clientWidth + 'px';
    }
    if (script_scroll.clientWidth != 0) {
        script.style.left = (img_width - script.clientWidth) / 2 + 'px';
    }

    const script_area = document.getElementById("script_area");
    if (onehand_rl == 'right') {
        script_area.style.left = '0px';
        onehand_uis.style.left = img_width + 'px';
    } else {
        script_area.style.left = onehand_uis.clientWidth + 'px';
        onehand_uis.style.left = '0px';
    }
}


let intervalid = null;
function addmask (row) {
    const masks = document.getElementById("masks");
    const p = document.createElement('p');
    const p_id = 'r' + row;
    p.id = p_id;
    p.className = "mask";

    const name = maskon["+人名"] == 1 && speaker[page][row] != "改行" 
                ? "+人名" 
                : speaker[page][row] != undefined 
                ? speaker[page][row] 
                : "その他";
    p.style.width = img_width * mag_width + 'px';
    p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
    p.style.top = img_width * mag_top[name] + 'px';
    p.style.left = img_width * mag_left_offset + img_width * mag_left_interval * (35 - row) + 'px';
    
    p.addEventListener('touchstart', mask_event);
    p.addEventListener('mousedown', mask_event);
    p.addEventListener('touchmove', (e) => {
        e.preventDefault();
    })

    masks.appendChild(p);    
}


const clickstart = (e) => {
    if (clicked == null) {
        clicked = e.target;
    }
}

const clickend = () => {
    if (clicked != null) {
        clicked = null;
    }
    pointer_x = null;
    pointer_y = null;
}

window.addEventListener('touchstart', clickstart);
window.addEventListener('mousedown', clickstart);
window.addEventListener('touchend', clickend);
window.addEventListener('mouseup', clickend);

let pointer_x;
let pointer_y;

window.addEventListener('touchmove', (e) => {
    if (clicked != null) {
        pointer_x = e.touches[0].pageX;
        pointer_y = e.touches[0].pageY;
    }
})

window.addEventListener('mousemove', (e) => {
    if (clicked != null) {
        pointer_x = e.pageX;
        pointer_y = e.pageY;
    }
})


const main = document.getElementById("main");
const tips = document.getElementById("tips");
let pagescroll = 0;

function close_tips () {
    tips.style.display = 'none';
    main.style.display = 'block';
    resize();
    window.scroll({top: pagescroll});
}

const close_tipsbtn = document.getElementById("close_tips");
close_tipsbtn.addEventListener('click', close_tips);

const open_tipsbtn = document.getElementById("open_tips");
open_tipsbtn.addEventListener('click', () => {
    pagescroll = window.scrollY;
    main.style.display = 'none';
    tips.style.display = 'block';
    window.scroll({top: 0});
})


function loadimg_befor (i, j, images) {
    if (imgloading['any'] == 1) {
        const img = document.createElement('img');
        const path = images == 'load_all' ? document.getElementById(loadimages_selected[i]).value : document.getElementById(images).value;
        img.src = allimages_folder_path + path +  '/page_' + ('000' + j).slice( -3 ) + '.png';
        img.style.display = 'none';
        img.addEventListener('load', () => {
            loadimg_after(i, j, images);
            img.remove();
        })

        const loadimages = document.getElementById("loadimages");
        loadimages.appendChild(img);
    } else if (imgloading['any'] == 2) {
        current_i.textContent = i;
        current_j.textContent = j;
    }
}

function loadimg_after (i, j, images) {
    denom = images == 'load_all' ? denominator : 79;
    if (processed_count == 0) {
        percent.textContent = parseInt((79 * i + (j + 1)) / denom * 90) + '%';
    } else if (processed_count < min_count[images]) {
        // percent.textContent = parseInt((79 * i + (j + 1) + denominator * processed_count) / (denominator * min_count) * 99) + '%';
        percent.textContent = parseInt((79 * i + (j + 1) + denom * (processed_count - 1)) / (denom * (min_count[images] - 1)) * 9 + 90) + '%';
    }

    j++;
    if (j == 79) {
        j = 0;
        i++;
    }

    if (i < 1 || (images == 'load_all' && i < loadimages_selected.length)) {
        loadimg_befor(i, j, images);
    } else {
        processed_count++;
        if (processed_count < min_count[images]) {
            loadimg_befor(0, 0, images);
        } else {
            if (images == 'load_all') {
                for (let k = 0; k < loadimages_selected.length; k ++) {
                    const isloaded = document.getElementById('isloaded_' + loadimages_selected[k]);
                    isloaded.textContent = '済';
                    if (imgloading[loadimages_selected[k]] == 0) {
                        const eachload_imgbtn = document.getElementById(loadimages_selected[k] + 'btn');
                        eachload_imgbtn.textContent = '再読み込み';
                    }
                }
            } else {
                const isloaded = document.getElementById('isloaded_' + images);
                isloaded.textContent = '済';
            }
            const load_imgbtn = document.getElementById(images + 'btn');
            load_imgbtn.textContent = images == 'load_all' ? '選択一括読み込み' : '再読み込み';
            percent.textContent = '100%';                
            completion.textContent = '完了';

            min_count[images] = 1;
            processed_count = 0;
            imgloading[images] = 0;
            imgloading['any'] = 0;
        }
    }
}

const loadimages_selected = [];
const loadimages = document.getElementsByName("loadimages");
for (let i = 0; i < loadimages.length; i++) {
    loadimages[i].addEventListener('change', (e) => {
        if (e.currentTarget.checked) {
            loadimages_selected.push(e.currentTarget.id);
        } else {
            loadimages_selected.splice(loadimages_selected.indexOf(e.currentTarget.id), 1);
        }
        denominator = 79 * (loadimages_selected.length)
    })
}

const min_count = {'load_all':2, "load_original":2, "load_narita_20250718":2, "load_narita_20250720":2};
let processed_count = 0;
let denominator;

const imgloading  = {'any':0, 'load_all':0, "load_original":0, "load_narita_20250718":0, "load_narita_20250720":0};
let current_i;
let current_j;
let progress;
let percent;
let completion;

const class_load_imgbtn = document.getElementsByClassName("load_imagesbtn");
for (let i = 0; i < class_load_imgbtn.length; i++) {
    class_load_imgbtn[i].addEventListener('click', () => {
        const images = class_load_imgbtn[i].id.split('btn')[0];
        if (imgloading['any'] == 0 && imgloading[images] == 0) {
            if (images != 'load_all' || loadimages_selected.length > 0) {
                imgloading['any'] = 1;
                imgloading[images] = 1;

                progress = document.getElementById('progress_' + images);
                percent = document.getElementById('percent_' + images);
                completion = document.getElementById('completion_' + images);
                current_i = document.getElementById('current_i_' + images);
                current_j = document.getElementById('current_j_' + images);

                progress.style.opacity = '100%';
                completion.textContent = '読み込み中';
                class_load_imgbtn[i].textContent = '一時停止';

                loadimg_befor(0, 0, images);
            }
        } else if (imgloading['any'] == 1 && imgloading[images] == 1) {
            imgloading['any'] = 0;
            imgloading[images] = 2;
            class_load_imgbtn[i].textContent = '再開';
        } else if (imgloading['any'] == 0 && imgloading[images] == 2) {
            imgloading['any'] = 1;
            imgloading[images] = 1;

            progress = document.getElementById('progress_' + images);
            percent = document.getElementById('percent_' + images);
            completion = document.getElementById('completion_' + images);
            current_i = document.getElementById('current_i_' + images);
            current_j = document.getElementById('current_j_' + images);

            loadimg_befor(Number(current_i.textContent), Number(current_j.textContent), images);
            class_load_imgbtn[i].textContent = '一時停止';
        }
    })
}


window.addEventListener('load', () => {
    imagechange();
    reload();
    resize();
})


const speaker = [
[],
[],
[,,,,,,,,,,,,'朝利','改行','改行','改行','改行',,,,,,,,,,,,,,,,'横内','ゆうき','横内','ゆうき'],
['改行','横内',,,,'横内','ゆうき','横内','改行','改行','ゆうき','横内',,,,'ゆうき','横内','ゆうき','横内','ゆうき','横内','ゆうき','横内','改行',,,,,'ゆうき','横内','改行','ゆうき','横内','改行','ゆうき',,],
[,,'横内','改行','改行','改行','改行','改行','ゆうき','横内','改行','改行','改行','改行','改行',,,,'横内','ゆうき','横内','改行','改行','ゆうき','横内','改行','改行','改行','ゆうき','横内','改行','改行','ゆうき','横内','ゆうき','横内'],
['ゆうき','横内','改行','ゆうき','横内','ゆうき','横内','改行','ゆうき','横内','改行','改行','ゆうき','横内','改行','ゆうき',,,,'横内','改行','改行','改行','ゆうき','横内',,,,'横内','ゆうき','横内',,,,,'横内'],
['ゆうき','横内','ゆうき','横内',,,,,,,'ゆうき','横内','改行','改行','ゆうき','横内','改行','ゆうき',,,,'横内','ゆうき','横内',,,,,,,,,,,,,],
[,,,,,,,,'望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','池谷','望月','池谷',,,,'池谷','望月','池谷','望月','板垣','望月','板垣','池谷','板垣','望月'],
['板垣','望月','池谷','望月','池谷','望月','板垣','望月','池谷','板垣','池谷','板垣','池谷','望月','板垣','池谷','朝利','望月',,,,,'朝利','板垣・望月','池谷','朝利','板垣・望月','朝利','板垣','望月','朝利', '板垣','朝利','望月','朝利','板垣'],
['朝利','板垣','朝利','板垣','朝利','板垣','望月','板垣','朝利','望月','板垣',,,,,'朝利','池谷',,,,'朝利','望月','朝利',,,,'望月','朝利','望月','板垣','望月','板垣','朝利','池谷','朝利','池谷'],
['板垣','望月','朝利',,,,,'池谷','望月','朝利','望月','板垣','朝利','改行','板垣','朝利','改行','改行','改行','改行','望月','池谷','望月','池谷','望月','池谷','望月','改行','改行','池谷','板垣','望月','板垣','望月','池谷','望月'],
['池谷','板垣','望月','板垣','池谷','望月','池谷','改行','望月','改行','板垣','望月','改行','改行','板垣','朝利','板垣','朝利','望月','朝利','望月','朝利','板垣','池谷','板垣','改行','望月','改行','朝利・板垣','池谷','望月','朝利・板垣・望月','改行','改行','池谷','板垣'],
['池谷','朝利','望月','池谷','板垣','池谷','朝利','板垣','朝利','板垣','望月','板垣','池谷','板垣','池谷','望月','池谷','朝利','池谷','改行','朝利','改行','池谷','改行','板垣','望月','改行','池谷','板垣','望月','板垣','朝利','改行','池谷','朝利','望月'],
['朝利','池谷','板垣','朝利','改行','改行','板垣','朝利','改行','改行','望月','池谷','朝利',,,,'板垣','望月','朝利','望月',,,,'板垣',,,,,'板垣・望月','朝利',,,,,'板垣','望月'],
['朝利','池谷','朝利','池谷',,,,'望月','朝利','板垣','池谷','望月','朝利','板垣','朝利','望月','板垣','朝利','朝利・板垣・望月','池谷',,,,'板垣','朝利','望月','板垣','朝利','板垣','朝利','望月','板垣',,,,'朝利'],
[,,,,'池谷','朝利','池谷','板垣','池谷','改行','望月','池谷','朝利','改行','改行','改行','改行','改行','改行','望月','朝利','板垣','朝利','板垣','望月','朝利','池谷',,,,'板垣',,,,'板垣','池谷'],
['望月','板垣','池谷','板垣','池谷','朝利','池谷',,,,,,,'横内','改行','望月',,,,'板垣','横内','板垣','横内','池谷','横内','改行','改行','ゆうき','板垣','横内','板垣','ゆうき','横内','朝利','横内','朝利'],
['横内','改行','ゆうき','池谷','ゆうき','横内','改行','改行','朝利','横内','改行','朝利','板垣','朝利','横内','朝利','横内','改行','板垣','池谷','板垣','朝利','板垣','朝利','板垣','横内','池谷','ゆうき','横内','ゆうき','横内','望月','ゆうき','望月','池谷','望月'],
['板垣','望月','ゆうき','池谷','望月','改行','池谷','望月','池谷','望月','池谷','板垣','池谷','望月','ゆうき','望月','横内','望月','朝利','望月','朝利','ゆうき','望月','朝利','池谷','横内','望月','横内','ゆうき','望月','池谷','望月','ゆうき',,,,],
['横内','改行','改行','改行','改行','ゆうき','望月','横内','改行','ゆうき',,,,'生島','池谷','横内','生島',,,,'横内','板垣',,,,'板垣','池谷','朝利','板垣',,,,'生島','望月','朝利','生島'],
[,,,'板垣','生島','板垣',,,,'生島','池谷','板垣','改行','生島','板垣','生島',,,,'板垣','池谷','朝利','板垣','朝利','望月',,,,'板垣','朝利','望月','池谷','朝利','望月','朝利','望月'],
['朝利・望月','池谷','朝利','ゆうき','望月','朝利','池谷','朝利','ゆうき','板垣','ゆうき','板垣','ゆうき','改行','改行','池谷','ゆうき','改行','朝利','改行','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき',,,,'望月','板垣・池谷','望月','改行','ゆうき','板垣'],
['ゆうき','望月','ゆうき',,,,,'ゆうき','改行','板垣','ゆうき','板垣','ゆうき','望月','ゆうき','池谷','ゆうき','板垣','ゆうき','改行',,,,'朝利','ゆうき','朝利','改行','ゆうき','朝利','板垣','朝利','改行','改行','改行','改行','板垣'],
['ゆうき','朝利','ゆうき','朝利','ゆうき','朝利','ゆうき','改行','改行','朝利','ゆうき','朝利','改行','ゆうき',,,,'朝利','板垣','朝利','板垣',,,,'ゆうき','板垣','ゆうき','望月','ゆうき','板垣','ゆうき',,,,,,],
[,,,,,,'朝利',,,,,,,'祐子','改行','改行','改行','改行','改行','改行','改行','改行',,,,,'生島','祐子','生島','祐子','生島','祐子','改行','改行','生島','祐子'],
[,,,,'横内',,,,,,,,,,,,,'祐子','改行','ゆうき','祐子','ゆうき','横内','祐子',,,,'横内','祐子',,,,'祐子','改行','ゆうき','祐子'],
['ゆうき','祐子','池谷','祐子','望月','祐子','ゆうき','横内','祐子','横内','板垣','祐子','横内','ゆうき','祐子',,,,'横内','祐子','ゆうき','横内','板垣','祐子','板垣','祐子','ゆうき','望月','板垣','望月','池谷','祐子','板垣',,,,],
[,'祐子','ゆうき','改行',,,,'祐子','朝利','祐子','ゆうき','朝利','板垣','朝利',,,,'祐子','朝利','横内','ゆうき','祐子','改行','横内','祐子','朝利','祐子','改行','朝利','祐子','朝利','祐子','朝利','祐子','朝利','池谷'],
['祐子','池谷','朝利','祐子','朝利','祐子','池谷','朝利','池谷','祐子','望月','祐子','望月','祐子','望月','祐子','朝利',,,,,,'池谷','板垣','池谷','板垣','池谷','板垣','池谷','朝利','祐子','横内','祐子','横内','祐子','ゆうき'],
['朝利','板垣','朝利',,,,'板垣','祐子','朝利','祐子','横内','ゆうき','横内','朝利',,,,'朝利','改行','祐子','朝利','改行','祐子','朝利','祐子','改行','朝利','祐子','朝利','祐子','横内','祐子','板垣','朝利','板垣・望月','朝利'],
[,,,'朝利','板垣','望月','朝利','池谷','祐子',,,,'朝利','祐子','横内','ゆうき','横内','ゆうき','祐子','朝利','祐子','朝利',,,,'祐子','朝利','望月','祐子','朝利','祐子','朝利','板垣','祐子',,,],
[,,,,,,,,,,'祐子','朝利','池谷','望月',,,,,'池谷','板垣',,,,,,,'祐子','池谷',,,,,,,,'板垣'],
['朝利・望月','板垣','朝利','望月','朝利','板垣','望月','板垣','望月','朝利・板垣','板垣','望月','板垣','望月','板垣','望月','朝利','板垣','朝利',,,,'祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子',,,,'朝利','板垣'],
['朝利','望月',,,,'祐子','改行','改行','池谷','祐子','池谷','祐子','池谷','祐子','改行','池谷','祐子','池谷','祐子',,,,'祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷'],
['祐子','改行','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子',,,,,,'祐子','ゆうき','祐子','ゆうき','祐子','ゆうき','祐子','ゆうき','改行','横内','ゆうき','横内','ゆうき','横内','ゆうき','横内','ゆうき','横内','ゆうき'],
['横内','祐子','横内','祐子','ゆうき','祐子','ゆうき','祐子','ゆうき','祐子','横内','祐子','横内','祐子','ゆうき','改行','祐子','改行','改行','改行','ゆうき','祐子','横内','ゆうき','祐子','池谷','祐子','池谷','祐子','池谷','祐子','横内',,,,'祐子'],
['朝利','祐子','横内','祐子','横内',,,,,,,,,,'ゆうき','板垣','ゆうき','望月','朝利','板垣','望月',,,,'朝利','改行','改行','板垣','朝利','改行','板垣','朝利','改行','改行','改行','ゆうき'],
['朝利','望月','朝利','望月','朝利','望月','朝利','望月','朝利','望月','朝利','改行','池谷','朝利','池谷',,,,'朝利','改行','ゆうき','朝利','ゆうき','朝利','ゆうき','朝利','板垣','朝利','朝利・板垣・望月','朝利','改行','改行','池谷','板垣','ゆうき','望月'],
['ゆうき','望月','ゆうき','望月','ゆうき','望月','改行','ゆうき','望月','改行','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき',,,,'望月','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき','改行','望月','ゆうき','望月','ゆうき','朝利'],
['改行','望月','池谷','板垣','朝利','板垣','朝利',,,,,'池谷','朝利','改行','板垣','朝利','改行','板垣','朝利',,,,'朝利','板垣','朝利','改行','改行','板垣','朝利','改行','改行','改行','改行','板垣','望月','朝利'],
['望月','朝利','板垣',,,,'池谷','板垣','池谷','板垣','望月','池谷','板垣','池谷',,,,'板垣','望月','板垣','板垣・望月','板垣','望月','板垣','望月','板垣','望月',,,,'板垣','望月','ゆうき','板垣','ゆうき','板垣'],
['望月','ゆうき','望月','ゆうき','望月','板垣','望月','板垣','望月',,,,'ゆうき','板垣','ゆうき','板垣','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき','望月',,,,,,,'ゆうき','望月','ゆうき','望月'],
['板垣','ゆうき','望月','改行','改行','改行','板垣','望月','板垣','ゆうき','板垣','改行','望月','ゆうき','板垣','望月','板垣','望月','ゆうき','望月','ゆうき','望月','板垣','ゆうき','板垣','ゆうき','板垣','改行','改行','改行','改行','望月','板垣','改行','望月','板垣'],
['望月','板垣','改行','改行','ゆうき','板垣','ゆうき','板垣','ゆうき','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','ゆうき','板垣','望月','ゆうき','板垣','ゆうき','望月','板垣','望月','板垣','望月','板垣','改行','望月','板垣','望月','板垣','ゆうき'],
['板垣','ゆうき','板垣','ゆうき','板垣','改行','望月','板垣','ゆうき','板垣','改行','ゆうき','板垣','望月','ゆうき','改行',,,,,,,,'祐子','横内','祐子','横内','祐子','横内','祐子','横内','祐子','横内','祐子','横内','祐子'],
['横内','祐子','横内','祐子','横内','改行','祐子',,,,,,,'池谷','朝利','池谷','朝利','池谷','朝利','池谷','朝利',,,,'池谷','朝利','池谷','朝利','池谷','改行','朝利','池谷','朝利','池谷','朝利','池谷'],
[,,,'池谷','朝利',,,,,,'池谷','生島','池谷','生島','池谷',,,,'生島','池谷','改行','生島','池谷','生島','池谷','朝利','池谷','生島','池谷','生島','池谷','朝利','池谷','生島','池谷','生島'],
['池谷','生島','池谷','生島','池谷','生島','朝利','生島','池谷','生島','池谷','生島','池谷','朝利','池谷','朝利','池谷',,,,,'生島','朝利','生島','朝利','生島','朝利',,,,'板垣','ゆうき','板垣','ゆうき','板垣','ゆうき'],
['板垣','ゆうき','改行','改行','改行','板垣','ゆうき','改行','改行','改行','改行',,,,'池谷','生島','池谷','生島','池谷','改行','生島','改行','池谷','生島','池谷','生島','改行','改行','改行','朝利','生島','改行','朝利','生島',,,],
[,'ゆうき','板垣','ゆうき','板垣','ゆうき','改行','板垣','ゆうき','板垣','ゆうき','望月','ゆうき','板垣','ゆうき','改行','板垣','ゆうき','改行','改行','板垣','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき','望月','ゆうき',,,,'朝利','池谷','朝利'],
['改行','池谷','朝利','改行','池谷',,,,,,,,,,,,,'朝利','池谷',,,,,,'池谷',,,,'池谷',,,,'池谷','生島','改行','池谷'],
[,,,,'生島','池谷',,,,'生島','池谷','生島','池谷',,,,,,,,,,,'ゆうき','板垣','ゆうき','望月',,,,'板垣','望月','板垣','望月','板垣','望月'],
['板垣','望月','板垣','望月','板垣','望月','板垣','改行','望月','改行','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','改行','板垣','望月','板垣','ゆうき','望月','ゆうき','望月','ゆうき','改行','望月','ゆうき','望月','ゆうき','望月','改行'],
['板垣','望月','改行','改行','改行','改行','ゆうき','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','望月','板垣','改行','ゆうき','板垣','改行','改行','望月','板垣','望月','板垣',,],
[,,'朝利','望月','朝利','望月','朝利','望月','朝利','板垣','朝利','改行','板垣','朝利',,,,,'ゆうき','朝利','望月','板垣','ゆうき','朝利','望月','朝利',,,,'板垣','望月','朝利',,,,'板垣'],
['朝利','板垣','朝利','板垣','朝利','板垣','朝利','板垣','朝利','改行','板垣',,,,'朝利','板垣','朝利','板垣','朝利','板垣','朝利','望月','朝利','望月','改行','朝利','望月','朝利','望月','朝利','板垣','朝利','板垣','朝利','板垣','朝利'],
['板垣','朝利','改行','板垣','朝利','板垣','朝利','ゆうき','朝利','板垣','ゆうき','望月','朝利','板垣','朝利','ゆうき','朝利','ゆうき','朝利','ゆうき','朝利',,,,'望月','板垣','朝利','板垣','望月','朝利','望月','朝利','望月','改行','朝利','望月'],
['改行','朝利','望月','板垣','朝利','望月','板垣','朝利','板垣','望月','朝利','望月','改行','朝利','望月','朝利','改行',,,,,'板垣','望月','板垣','望月','板垣','望月','朝利','板垣・望月',,,,'池谷','改行','望月','池谷'],
['望月','池谷','改行','板垣','池谷','板垣','池谷','ゆうき','池谷','ゆうき','池谷','ゆうき','池谷','朝利','池谷','改行','朝利','池谷',,,,,,,,,'池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子'],
['池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','改行','池谷','祐子','池谷','祐子','池谷','祐子','池谷','祐子','池谷',,,,'池谷',,,,,,,,,,'池谷'],
['生島','板垣','朝利','板垣','生島','朝利','板垣','生島','板垣','生島','望月','池谷','生島','望月','池谷','生島','板垣','朝利','改行','生島','朝利','生島','朝利','生島','池谷','改行','生島','池谷','板垣','池谷','生島','朝利','生島','望月','朝利','生島'],
[,,,'生島','改行','ゆうき','望月','生島','望月','ゆうき','板垣','ゆうき','板垣','ゆうき','板垣','朝利','望月','朝利','板垣','朝利','生島','改行','望月','池谷','朝利',,,,'朝利',,,,'朝利','生島','池谷',,],
[,,'祐子','生島','祐子','朝利','祐子','朝利','祐子','朝利','祐子','生島','祐子','朝利','祐子','生島','祐子','生島','祐子','改行','改行','朝利','祐子','朝利','祐子','改行','改行','望月','生島','祐子','生島','祐子','生島','改行','改行','祐子'],
['生島','改行','祐子','生島','祐子','生島','祐子','生島','改行','祐子','朝利','生島','池谷','生島','改行','池谷','祐子','池谷','生島','池谷','板垣','池谷','祐子','生島','池谷','生島','板垣','池谷','望月','池谷',,,,,'横内','祐子'],
['横内','祐子','横内','改行','祐子','横内','祐子','改行','横内','祐子','改行','横内','祐子','横内','祐子','横内','板垣','祐子','横内','改行','板垣','望月','池谷','横内','祐子','横内','祐子','横内','改行','改行','改行','改行','祐子','横内','ゆうき','横内'],
[,,,'横内','改行','ゆうき','横内','望月','板垣','望月','改行','ゆうき','望月','改行','改行','横内','望月','板垣','望月','改行','ゆうき','望月','改行','生島','池谷','生島','改行','池谷','生島','望月','生島','改行','祐子','改行','横内','生島'],
['改行','横内','生島','望月','生島','横内','祐子','横内','生島','祐子','朝利','生島','望月','板垣','望月','祐子','望月','改行','改行','板垣','望月','改行','朝利','望月','板垣','朝利','望月','改行','ゆうき','望月','ゆうき','改行','祐子','ゆうき','改行','祐子'],
['ゆうき','改行','板垣','ゆうき','改行','望月','ゆうき','改行','改行','朝利','望月','板垣','ゆうき','朝利','ゆうき','改行','改行','改行','朝利','板垣','ゆうき','祐子','朝利','祐子','朝利','望月','改行','利','望月','朝利','板垣','望月','ゆうき','朝利','祐子','改行'],
['ゆうき','改行','改行','朝利','祐子','ゆうき','朝利','ゆうき','朝利','改行','ゆうき','朝利','ゆうき','朝利','改行','ゆうき','改行','祐子','朝利','祐子','改行','改行','改行','朝利','祐子','改行','朝利','ゆうき','朝利','祐子','朝利','ゆうき','朝利','改行','ゆうき','朝利'],
['ゆうき','改行','改行','朝利',,,,,,,,'横内','生島','祐子','生島','朝利','生島','朝利','改行','改行','改行','改行','生島','改行','朝利','生島','朝利',,,,'祐子','朝利','板垣',,,,],
['板垣','望月','板垣',,,,'祐子','池谷',,,,'生島','祐子','生島','改行','祐子','横内','祐子','改行','改行','改行','ゆうき','祐子','ゆうき','祐子','改行','改行','生島','祐子',,,,'池谷','祐子','池谷',,],
[,,,,,,,,'朝利',,,,,,'板垣','朝利','望月','朝利','望月','板垣','望月','朝利','板垣','朝利','改行','望月','朝利','望月','朝利','望月','望月','改行','朝利','望月','朝利','望月'],
['板垣','朝利','板垣','朝利','板垣','朝利','板垣','朝利','望月','改行','朝利','板垣','改行','改行','朝利','板垣','望月','改行','朝利','板垣','朝利','望月','朝利','板垣','朝利',,,,,,,,,,,,],
['祐子','池谷','祐子','池谷','改行','祐子','ゆうき','祐子','池谷','ゆうき','池谷','祐子','池谷','祐子',,,,,,'板垣','改行','望月','改行',,,,'板垣','望月','板垣',,,,,,,,],
[,,,,,,'朝利',,,,,,'望月','朝利','望月','朝利','板垣','望月','朝利','板垣','望月','朝利','板垣','望月','改行',,,,'朝利','板垣','朝利',,,,'朝利',,],
[,,,,,,,,,,,'板垣',,,,,,,,,'板垣','朝利','望月','朝利','望月','ゆうき','改行','池谷','望月','板垣','望月','ゆうき','板垣','朝利','板垣','ゆうき'],
['改行','板垣','ゆうき','望月','朝利','望月','池谷','望月','池谷','板垣','池谷','望月','朝利','池谷','望月',,,,'祐子','改行','朝利','祐子','朝利','望月','板垣','朝利','祐子',,,,'祐子','改行','朝利','望月','板垣','祐子'],
[,,,'朝利','板垣','ゆうき','池谷','ゆうき','池谷','ゆうき','池谷','板垣','朝利','望月','ゆうき','望月','ゆうき','望月','ゆうき','望月','板垣','朝利','池谷','望月','板垣','朝利','ゆうき','望月','板垣',,,,,,,,],
[,,,,,,,,,,,,,,,,,,,,]];
