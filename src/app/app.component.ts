import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private renderer: THREE.WebGLRenderer | undefined;
  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private animationFrameId: number | null = null;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    // Ensure this code runs in the browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initThree();
      this.makeModel();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const container = this.el.nativeElement.querySelector('#three-container');

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      this.camera.position.z = 5;

      // Add basic lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      // Handle window resize
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
  }

  private makeModel(): void {
    if (this.renderer && this.scene) {
      const loader = new GLTFLoader();
      loader.load('assets/gaming_room.glb', (gltf) => {
        this.scene!.add(gltf.scene);
        this.animate();
      }, undefined, (error) => {
        console.error('An error happened while loading the GLB model.', error);
      });
    }
  }

  private animate(): void {
    if (this.renderer && this.scene && this.camera) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    }
  }

  @HostListener('window:resize')
  private onWindowResize(): void {
    if (this.renderer && this.camera) {
      const container = this.el.nativeElement.querySelector('#three-container');
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
    }
  }
}
