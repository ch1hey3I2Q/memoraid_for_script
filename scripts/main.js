let page = 0;

const allimages_folder_path = './images';

const maskon = {"朝利":0, "板垣":0, "望月":0, "池谷":0, "生島":0, "横内":0, "ゆうき":0, "祐子":0, "+人名":0, "その他":0};
const idToname = {"asari":"朝利", "itagaki":"板垣", "mochiduki":"望月", "iketani":"池谷", "kijima":"生島", "yokouchi":"横内", "yuuki":"ゆうき", "yuuko":"祐子", "name":"+人名", "others":"その他"};

const exception = {"朝利・板垣":["朝利", "板垣"], "朝利・望月":["朝利", "望月"], "板垣・望月":["板垣", "望月"], "朝利・板垣・望月":["朝利", "板垣", "望月"], "板垣・池谷":["板垣", "池谷"], "利":["朝利"]};

const mag_width = 0.015;
const mag_bottom = 0.561;
const mag_top = {"朝利":0.121, "利":0.110, "板垣":0.121, "望月":0.121, "池谷":0.121, "生島":0.121, "横内":0.121, "ゆうき":0.132, "祐子":0.121, "朝利・板垣":0.155, "朝利・望月":0.155, "板垣・望月":0.155, "朝利・板垣・望月":0.188, "板垣・池谷":0.155, "改行":0.107, "+人名":0.093, "その他":0.093};
const mag_left_offset = 0.1535;
const mag_left_interval = 0.01953;

const mag_arrowboxes_width = 0.050;

const class_arrowboxes = document.getElementsByClassName("arrowboxes");
const class_mask = document.getElementsByClassName("mask");

const script_img = document.getElementById("script_img");
let img_width;


for (let i = 0; i < class_arrowboxes.length; i++) {
    class_arrowboxes[i].addEventListener('click', () => {
        page += (i * 2 - 1);
        if (page < 0) {
            page = 0;
        } else if (page > 78) {
            page = 78;
        }
        reload();
    })
}

document.body.addEventListener('keydown', (e) => {
    if (main.style.visibility == 'visible') {
        switch (e.code) {
            case 'ArrowRight':
                e.preventDefault();
                page = page > 0 ? page - 1 : page;
                reload(); 
                break;
            case 'ArrowLeft':
                e.preventDefault();
                page = page < 78 ? page + 1 : page;
                reload();
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
                        page++;
                    reload();
                    }
                } else {
                    inputpage.blur();
                    window.scroll({top: 0});
                }
                break;
        }
    } else if (e.code == 'Enter') {
        if (page == 0) {
            reload();
        }
        tips.style.visibility = 'hidden';
        main.style.visibility = 'visible';
    }
})


const checkboxes = document.getElementsByName("checkboxes");
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', (e) => {
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
    
    main.style.width = img_width + 'px';
    main.style.left = (window_width - img_width) / 2 + 'px';

    for (let i = 0; i < class_arrowboxes.length; i++) {
        class_arrowboxes[i].style.width = img_width * mag_arrowboxes_width + 'px';
        class_arrowboxes[i].style.height = img_height + 'px';
        class_arrowboxes[i].style.top = img_height / 2 + 'px';
        class_arrowboxes[i].style.left = img_width * (-i + 1) + 'px';
    }

    for (let i = 0; i < class_mask.length; i++) {
        const row = class_mask[i].id.replace(/[^0-9]/g, '');
        const name = maskon["+人名"] == 1 && speaker[page][row] != "改行" ? "+人名" : speaker[page][row];
        class_mask[i].style.width = img_width * mag_width + 'px';
        class_mask[i].style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
        class_mask[i].style.top = img_width * mag_top[name] + 'px';
        class_mask[i].style.left = img_width * mag_left_offset + img_width * mag_left_interval * (35 - row) + 'px';
    }

    const options = document.getElementById("options");
    options.style.top = img_height + 'px';
}


const istouchable = window.ontouchstart === undefined ? false : true;

let pointer_x;
let pointer_y;
if (istouchable) {
    window.addEventListener('touchmove', (e) => {
        if (mask_clicked != null) {
            pointer_x = e.touches[0].pageX;
            pointer_y = e.touches[0].pageY;
        }
    })
} else {
    window.addEventListener('mousemove', (e) => {
        if (mask_clicked != null) {
            pointer_x = e.pageX;
            pointer_y = e.pageY;
        }
    })
}


let mask_clicked = null;
let downtime;
let islongclick = false;
let intervalid = null;
function addmask (row) {
    const masks = document.getElementById("masks");
    const p = document.createElement('p');
    const p_id = 'r' + row;
    p.id = p_id;
    p.className = "mask";

    const name = maskon["+人名"] == 1 && speaker[page][row] != "改行" ? "+人名" : speaker[page][row] != undefined ? speaker[page][row] : "その他";
    p.style.width = img_width * mag_width + 'px';
    p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
    p.style.top = img_width * mag_top[name] + 'px';
    p.style.left = img_width * mag_left_offset + img_width * mag_left_interval * (35 - row) + 'px';

    if (istouchable) {
        p.addEventListener('touchstart', (e) => {
            e.preventDefault();
            downtime = performance.now();
            mask_clicked = e.target;
            setTimeout(() => {
                if (mask_clicked != null && mask_clicked == e.target && performance.now() - downtime >= 500) {
                    islongclick = true;
                }
            }, 500);
            pointer_x = e.pageX;
            pointer_y = e.pageY;
            const down_x = e.touches[0].pageX;
            const down_y = e.touches[0].pageY;
            if (intervalid == null) {
                intervalid = setInterval(() => {
                    if (islongclick || pointer_x != down_x || pointer_y != down_y) {
                        if (img_width * mag_top[name] >= pointer_y) {
                            p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                            p.style.top = img_width * mag_top[name] + 'px';
                        } else if (img_width * mag_bottom <= pointer_y) {
                            p.style.height = '0px';
                        } else {
                            p.style.height = img_width * mag_bottom - pointer_y + 'px';
                            p.style.top = pointer_y + 'px';
                        }
                    }
                    if (mask_clicked == null) {
                        if (islongclick) {
                            islongclick = false;
                            p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                            p.style.top = img_width * mag_top[name] + 'px';
                        } else {
                            p.remove();
                        }
                        clearInterval(intervalid);
                        intervalid = null;
                    }
                }, 0);
            }
        })
    } else {
        p.addEventListener('mousedown', (e) => {
            downtime = performance.now();
            mask_clicked = e.target;
            setTimeout(() => {
                if (mask_clicked != null && mask_clicked == e.target && performance.now() - downtime >= 500) {
                    islongclick = true;
                }
            }, 500);
            pointer_x = e.pageX;
            pointer_y = e.pageY;
            const down_x = e.pageX;
            const down_y = e.pageY;
            if (intervalid == null) {
                intervalid = setInterval(() => {
                    if (islongclick || pointer_x != down_x || pointer_y != down_y) {
                        if (img_width * mag_top[name] >= pointer_y) {
                            p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                            p.style.top = img_width * mag_top[name] + 'px';
                        } else if (img_width * mag_bottom <= pointer_y) {
                            p.style.height = '0px';
                        } else {
                            p.style.height = img_width * mag_bottom - pointer_y + 'px';
                            p.style.top = pointer_y + 'px';
                        }
                    }
                    if (mask_clicked == null) {
                        if (islongclick) {
                            islongclick = false;
                            p.style.height = img_width * (mag_bottom - mag_top[name]) + 'px';
                            p.style.top = img_width * mag_top[name] + 'px';
                        } else {
                            p.remove();
                        }
                        clearInterval(intervalid);
                        intervalid = null;
                    }
                }, 0);
            }
        })
    }
    

    masks.appendChild(p);    
}

if (istouchable) {
    window.addEventListener('touchend', (e) => {
        if (mask_clicked != null) {
            mask_clicked = null;
        }
    })
} else {
    window.addEventListener('mouseup', () => {
        if (mask_clicked != null) {
            mask_clicked = null;
        }
    })
}


const main = document.getElementById("main");
const tips = document.getElementById("tips");

const close_tipsbtn = document.getElementById("close_tips");
close_tipsbtn.addEventListener('click', () => {
    if (page == 0) {
        reload();
    }
    tips.style.visibility = 'hidden';
    main.style.visibility = 'visible';
})

const open_tipsbtn = document.getElementById("open_tips");
open_tipsbtn.addEventListener('click', () => {
    main.style.visibility = 'hidden';
    tips.style.visibility = 'visible';
    window.scroll({top: 0});
})


function loadimg_befor (i, j) {
    if (imgloading == 1) {
        const img = document.createElement('img');
        img.src = allimages_folder_path + useimages[i].value +  '/page_' + ('000' + j).slice( -3 ) + '.png';
        img.style.display = 'none';
        img.addEventListener('load', () => {
            loadimg_after(i, j);
            img.remove();
        })

        const loadimages = document.getElementById("loadimages");
        loadimages.appendChild(img);
    } else if (imgloading == 2) {
        current_i.textContent = i;
        current_j.textContent = j;
    }
}

function loadimg_after (i, j) {
    if (processed_count == 0) {
        percent.textContent = parseInt((79 * i + (j + 1)) / denominator * 80) + '%';
    } else if (processed_count < min_count) {
        // percent.textContent = parseInt((79 * i + (j + 1) + denominator * processed_count) / (denominator * min_count) * 99) + '%';
        percent.textContent = parseInt((79 * i + (j + 1) + denominator * (processed_count - 1)) / (denominator * (min_count - 1)) * 19 + 80) + '%';
    }
    j++;
    if (j == 79) {
        j = 0;
        i++;
    }
    if (i < useimages.length) {
        loadimg_befor(i, j);
    } else {
        processed_count++;
        if (processed_count < min_count) {
            loadimg_befor(0, 0);
        } else {
            loadimgstopbtn.style.opacity = '0%';
            percent.textContent = '100%';
            completion.textContent = '完了';
            min_count = 1;
            processed_count = 0;
            imgloading = 0;
        }
    }
}

const progress = document.getElementById("progress");
const percent = document.getElementById("percent");
const completion = document.getElementById("completion");

const denominator = 79 * (useimages.length);
let min_count = 2;
let processed_count = 0;

let imgloading = 0;

const loadimgbtn = document.getElementById("loadimagesbtn");
loadimgbtn.addEventListener('click', () => {
    if (imgloading == 0) {
        imgloading = 1;
        loadimgstopbtn.style.opacity = '100%';
        progress.style.opacity = '100%';
        completion.textContent = '読み込み中'
        loadimg_befor(0, 0);
    }
})

const current_i = document.getElementById("current_i");
const current_j = document.getElementById("current_j");

const loadimgstopbtn = document.getElementById("loadimagesstopbtn");
loadimgstopbtn.addEventListener('click', () => {
    if (imgloading == 1) {
        imgloading = 2;
        loadimgstopbtn.textContent = '再開';
    } else if (imgloading == 2) {
        imgloading = 1;
        loadimg_befor(Number(current_i.textContent), Number(current_j.textContent));
        loadimgstopbtn.textContent = '一時停止';
    }
})


imagechange();
resize();


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
