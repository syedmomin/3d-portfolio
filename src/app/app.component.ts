import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeScene();
    this.loadModel();
  }

  private initializeScene(): void {
    this.scene = new THREE.Scene();
    const canvas = this.canvasRef.nativeElement;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;

    this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 2, 15);
    this.camera.lookAt(new THREE.Vector3(0, 2, 0));

    // Initialize Lights
    this.scene.add(new THREE.AmbientLight(0xffffff, 2.5));
  }


  private async loadModel(): Promise<void> {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync('./assets/model/gaming_room.glb');
      const model = gltf.scene;
      model.scale.set(4, 3.9, 4);
      model.position.set(0, -5, 0);
      model.rotation.y = -Math.PI / 3.5;

      this.scene.add(model);
      this.renderLoop();
    } catch (error) {
      console.error('Failed to load the model:', error);
    }
  }

  private renderLoop(): void {
    const render = () => {
      requestAnimationFrame(render);
    };
    render();
  }
}
