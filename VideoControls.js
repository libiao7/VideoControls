let pointerDownVX, pointerDownVY, pointerdownWidth = 0


addEventListener('pointerdown', function (e) {
    pointerdownWidth = e.width
    if (document.fullscreenElement?.tagName == 'VIDEO' && e.isPrimary) {
        e.target.pause()
        e.stopImmediatePropagation()
        e.preventDefault()
        pointerDownVX = e.screenX
        pointerDownVY = e.screenY
    }
}, { capture: true/*, passive: false*/ })
addEventListener('touchstart', function (e) {
    if (document.fullscreenElement?.tagName == 'VIDEO') {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('touchend', function (e) {
    if (document.fullscreenElement?.tagName == 'VIDEO') {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true/*, passive: false*/ })
addEventListener('pointerup', function (e) {
    if (document.fullscreenElement?.tagName == 'VIDEO') {
        e.stopImmediatePropagation()
        e.preventDefault()
        if (document.fullscreenElement == e.target && e.isPrimary) {
            let xMv = Math.abs(e.screenX - pointerDownVX)
            let yMv = Math.abs(e.screenY - pointerDownVY)
            if (xMv > 20 && xMv > yMv) {
                e.target.currentTime += xMv * xMv / 625 * Math.sign(e.screenX - pointerDownVX)
                e.target.play()
            }
            else if (yMv > 20 && yMv > xMv) {
                if (e.screenY > pointerDownVY) {
                    e.target.controls = true
                    e.target.pause()
                    e.target.playbackRate = 1
                }
                else if (e.screenY < pointerDownVY) {
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
    else if (!document.fullscreenElement && e.isPrimary && pointerdownWidth > 26) {
        for (let video of document.querySelectorAll('video')) {
            let videoRect = video.getBoundingClientRect();
            if (e.clientX >= videoRect.left && e.clientX <= videoRect.right && e.clientY >= videoRect.top && e.clientY <= videoRect.bottom) {
                e.stopImmediatePropagation()
                e.preventDefault()
                let vel = video
                while (vel) {
                    vel.style.setProperty('pointer-events', 'auto', 'important')
                    vel = vel.parentElement
                }
                video.requestFullscreen()
                video.muted = false
                video.controls = true
                video.play()
                break
            }
        }
    }
}, { capture: true/*, passive: false*/ })
/*addEventListener('click', function (e) {
    if (document.fullscreenElement) {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true })
addEventListener('dblclick', function (e) {
    e.stopImmediatePropagation()
    e.preventDefault()
}, { capture: true })*/
addEventListener('contextmenu', function (e) {
    if (document.fullscreenElement?.tagName == 'VIDEO') {
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, { capture: true })
addEventListener("visibilitychange", () => {
    if (document.visibilityState == 'hidden' || document.hidden)
        for (let video of document.querySelectorAll('video'))
            video.pause()
})
if (window !== top)
    document.addEventListener('DOMContentLoaded', function () {
        new MutationObserver((mutationRecords, o) => {
            for (let r of mutationRecords) {
                for (let a of r.addedNodes) {
                    if (a.nodeType === 1) {
                        if (a.tagName === 'VIDEO') {
                            if (a.src?.indexOf('http') === 0)
                                location.href = a.src.replace('http://', 'https://')
                        } else for (let v of a.querySelectorAll('video')) {
                            if (v.src?.indexOf('http') === 0)
                                location.href = v.src.replace('http://', 'https://')
                        }
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true })
    })
