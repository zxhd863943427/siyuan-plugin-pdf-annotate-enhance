const { Plugin } = require('siyuan');
let lastClick;
let TextChose = false;
function hasClass(dom, name) {
    return dom.classList && dom.classList.value.indexOf(name) != -1
}
class getLastClick {

    constructor(eventBus) {
        this.eventBus = eventBus
        this.eventBus.on("click-editorcontent", this.getLast)
        this.eventBus.on("click-pdf", this.ChangeSelection)
    }
    getLast(detail) {
        console.log("get last")
        lastClick = getSelection().getRangeAt(0)
    }

    ChangeSelection({ detail: t }) {

        if (!(isTextChoseColor(t)) && !(isAreaChose(t)) && !(isCopy(t))) {
            setIfTextChose(t)
            return
        }

        console.log("get click")
        let selection = getSelection()
        setTimeout(() => {
            selection.removeAllRanges();
            selection.addRange(lastClick)
        }, 300)
    }
    stop(){
        this.eventBus.off("click-editorcontent", this.getLast)
        this.eventBus.off("click-pdf", this.ChangeSelection)
    }
}

function setIfTextChose(t) {
    let target = t.event.srcElement
    let isDiv = target instanceof HTMLDivElement
    if (isDiv && hasClass(target, "textLayer") && !t.event.altKey) {
        TextChose = true
        setTimeout(() => { TextChose = false }, 10000)
    }
}

function isTextChoseColor(t) {
    let target = t.event.srcElement
    let isButton = target instanceof HTMLButtonElement
    let currentTextChose = TextChose
    TextChose = false
    return isButton && hasClass(target, "color__square") && currentTextChose
}

function isAreaChose(t) {
    let target = t.event.srcElement
    let isDiv = target instanceof HTMLDivElement
    return (isDiv && hasClass(target, "textLayer") && t.event.altKey)
}

function isCopy(t) {
    let target = t.event.srcElement
    let isButton = target instanceof HTMLButtonElement
    let isSpan = target instanceof HTMLSpanElement
    return (isButton || isSpan) && hasClass(target, "b3-menu__label") && target.innerText === siyuan.languages.copyAnnotation
}

module.exports = class pdfAnnotateEnhance extends Plugin {
    onload() {
        this.getLastClick = new getLastClick(this.eventBus);
    }
    onunload(){
        this.getLastClick.stop()
    }
}