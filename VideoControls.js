let pointerDownVX
let pointerDownVY
let ptDnX
let ptDnY
let fullscreensetTimeoutID

addEventListener('pointerdown', function (e) {
    ptDnX = e.screenX
    ptDnY = e.screenY
    if (document.fullscreenElement?.tagName == 'VIDEO' && e.isPrimary) {
        e.target.pause()
        e.stopImmediatePropagation()
        e.preventDefault()
        pointerDownVX = e.screenX
        pointerDownVY = e.screenY
    }
    else if (!document.fullscreenElement && e.isPrimary/*&&e.screenX === ptDnX&&e.screenY === ptDnY*/) {
        fullscreensetTimeoutID=setTimeout(()=>{
            for(let video of document.querySelectorAll('video')){
                let videoRect = video.getBoundingClientRect();
                if (e.clientX >= videoRect.left && e.clientX <= videoRect.right && e.clientY >= videoRect.top && e.clientY <= videoRect.bottom) {
                    e.stopImmediatePropagation()
                    e.preventDefault()
                    video.requestFullscreen()
                    video.muted = false
                    video.controls = true
                    video.play()
                    break
                }
            }
        },255)
    }
    else if (window !== top && e.target.src.indexOf('http') === 0)
            location.href = e.target.src.replace('http://', 'https://')
}, { capture: true/*, passive: false*/ })
addEventListener('touchstart', function (e) {
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('pointermove', function (e) {
    clearTimeout(fullscreensetTimeoutID)
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('touchmove', function (e) {
   if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('touchend', function (e) {
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('pointerup', function (e) {
    clearTimeout(fullscreensetTimeoutID)
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
        if (document.fullscreenElement==e.target && e.isPrimary) {
            let xMv = Math.abs(e.screenX - pointerDownVX)
            let yMv = Math.abs(e.screenY - pointerDownVY)
            if (xMv > 20 && xMv > yMv) {
                e.target.currentTime +=  xMv*xMv / 625 * Math.sign(e.screenX - pointerDownVX)
                e.target.play()
            }
            else if (yMv > 20 && yMv > xMv) {
                if(e.screenY>pointerDownVY){
                    e.target.controls = true
                    e.target.pause()
                    e.target.playbackRate = 1
                }
                else if(e.screenY<pointerDownVY){
                    e.target.controls = false
                    e.target.playbackRate = 2
                    e.target.play()
                }
            }
            else {
                e.target.controls = false
                e.target.play()
            }
        }
    }
}, { capture: true/*, passive: false*/ })
addEventListener('click', function (e) {
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true })
addEventListener('dblclick', function (e) {
    e.stopImmediatePropagation()
    e.preventDefault()
}, { capture: true })
addEventListener('contextmenu', function (e) {
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true })
