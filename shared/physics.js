class Physics {

    constructor() {
        this.server = Physics.isServer();
        this.x = this.server ? 0 : 'x';
        this.y = this.server ? 1 : 'y';
    }

    /**
     * Determine if we are running in node.js instance or client
     */
    static isServer() {
        try {
            return process && process.env;
        } catch (err) {}
        return false;
    }

    movetoPointer(displayObject, speed, pointer, maxTime) {
    
        if (maxTime === undefined) { maxTime = 0; }
    
        var angle = this.angleToPointer(displayObject, pointer);
    
        if (maxTime > 0) {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToPointer(displayObject, pointer) / (maxTime / 1000);
        }
    
        displayObject.body.velocity[this.x] = Math.cos(angle) * speed;
        displayObject.body.velocity[this.y] = Math.sin(angle) * speed;
    
        return angle;
    }
    
    distanceToPointer(displayObject, pointer, world) {
    
        if (world === undefined) { world = false; }
    
        let position = this.server ? displayObject.body.position : displayObject;
    
        var dx = (world) ? displayObject.world.x - pointer.worldX : position[this.x] - pointer.worldX;
        var dy = (world) ? displayObject.world.y - pointer.worldY : position[this.y] - pointer.worldY;
    
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    angleToPointer(displayObject, pointer, world) {
    
        if (world === undefined) { world = false; }
    
        if (world) {
            return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);
        }
        else {
            let position = this.server ? displayObject.body.position : displayObject;
            return Math.atan2(pointer.worldY - position[this.y],
                pointer.worldX - position[this.x]);
        }
    }
}


if (Physics.isServer()) {
    module.exports = new Physics()
}