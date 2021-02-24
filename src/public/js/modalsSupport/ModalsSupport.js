function ModalsSupport() {};

ModalsSupport.prototype.show = function(_modal) {
    _modal.style.display = "block";
    setTimeout(() => {
        _modal.classList.add("show");
    }, 100);
} 

ModalsSupport.prototype.hidden = function(_modal) {
    _modal.classList.remove("show");
    setTimeout(() => {
        _modal.style.display = "none";
    }, 100);
}

ModalsSupport.prototype.hiddenOverlay = function(e,_modal) {
    if(e.target == _modal)
        this.hidden(_modal);
}

export { ModalsSupport }