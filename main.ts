import * as THREE from "three";

function main() {
    const canvas = document.getElementById("c");
    if (canvas === null) {
        throw new Error("canvas not found");
    }
    const scene = new Scene(canvas as HTMLCanvasElement);
    scene.start();
}

class Scene {
    scene: THREE.Scene = new THREE.Scene();
    objects: THREE.Object3D[] = [];
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera = init_camera();
    light: THREE.DirectionalLight = create_light();

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        this.objects = [
            makeInstance(geometry, 0x44aa88, 0),
            makeInstance(geometry, 0x8844aa, -2),
            makeInstance(geometry, 0xaa8844, 2),
        ];
        this.scene.add(...this.objects);
        this.scene.add(this.light);
        this.scene.add(this.camera);
        this.camera.position.z = 2;
    }

    start() {
        function render(time: number) {
            time *= 0.001; // convert time to seconds

            if (resizeRendererToDisplaySize(this.renderer)) {
                const canvas = this.renderer.domElement;
                this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.camera.updateProjectionMatrix();
            }

            this.objects.forEach((obj: THREE.Object3D, ndx: number) => {
                const speed = 1 + ndx * 0.1;
                const rot = time * speed;
                obj.rotation.x = rot;
                obj.rotation.y = rot;
            });

            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render.bind(this));
        }
        requestAnimationFrame(render.bind(this));
    }
}

function makeInstance(geometry: THREE.Geometry, color: number, x: number) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    return cube;
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function init_camera() {
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return camera;
}

function create_light() {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    return light;
}

main();
