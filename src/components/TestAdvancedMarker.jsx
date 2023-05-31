const icon = document.createElement("div");
icon.innerHTML =
  `<i class='materiak-icons' style='margin-top: 10px'>camera</i>` +
  `<span class="sidecontent">THis is content</span>`;
const faPinView = new google.maps.marker.PinView({
  glyph: icon,
  glyphColor: "white",
  background: "green",
  borderColor: "black",
});

const myLatLng = { lat: latitude, lng: longitude, altitude: 50 };
const marker = new google.maps.marker.AdvancedMarkerView({
  map,
  position: myLatLng,
  content: faPinView.element,
  title: "Hello World",
});

//
loader = new THREE.GLTFloader();

const source = "assets/3d/three.glb";
loader.load(source, (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.rotation.x = Math.PI;
});
scene.add(gltf.scene);
