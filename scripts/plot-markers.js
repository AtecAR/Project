document.addEventListener("DOMContentLoaded", function () {
    const markers = ["marker1", "marker2"];
    const markerEntities = markers.map(marker => document.querySelector(`#${marker}`));
    const markerObjects = markerEntities.map(marker => document.querySelector(`#${marker}-entity`));

    const scene = document.querySelector('a-scene');
    const markerCenters = [];

    markerEntities.forEach((marker, index) => {
        marker.addEventListener('markerFound', function () {
            const matrix = marker.object3D.matrixWorld;
            const center = getMarkerCenter(matrix);

            // 中心点の赤い球体をプロット
            const centerSphere = document.createElement('a-sphere');
            centerSphere.setAttribute('color', 'red');
            centerSphere.setAttribute('radius', '0.05');
            centerSphere.setAttribute('position', `${center.x} ${center.y} ${center.z}`);
            markerObjects[index].appendChild(centerSphere);

            // 頂点を緑の球体でプロット
            plotMarkerVertices(matrix, markerObjects[index]);

            markerCenters[index] = center;

            // 複数マーカーの中心点を結ぶ青い線を描画
            drawCenterLines(markerCenters, scene);
        });

        marker.addEventListener('markerLost', function () {
            markerObjects[index].innerHTML = '';  // マーカーを見失ったらポイントを削除
            markerCenters[index] = null;
            drawCenterLines(markerCenters, scene);
        });
    });

    function getMarkerCenter(matrix) {
        return new THREE.Vector3().setFromMatrixPosition(matrix);
    }

    function plotMarkerVertices(matrix, entity) {
        const vertices = [
            new THREE.Vector3(-0.5, 0, -0.5),
            new THREE.Vector3(0.5, 0, -0.5),
            new THREE.Vector3(0.5, 0, 0.5),
            new THREE.Vector3(-0.5, 0, 0.5)
        ];

        vertices.forEach(vertex => {
            vertex.applyMatrix4(matrix);
            const vertexSphere = document.createElement('a-sphere');
            vertexSphere.setAttribute('color', 'green');
            vertexSphere.setAttribute('radius', '0.05');
            vertexSphere.setAttribute('position', `${vertex.x} ${vertex.y} ${vertex.z}`);
            entity.appendChild(vertexSphere);
        });
    }

    function drawCenterLines(centers, scene) {
        scene.querySelectorAll('.center-line').forEach(line => line.remove());  // 既存のラインを削除

        for (let i = 0; i < centers.length - 1; i++) {
            if (centers[i] && centers[i + 1]) {
                const line = document.createElement('a-entity');
                line.setAttribute('line', {
                    start: centers[i],
                    end: centers[i + 1],
                    color: 'blue'
                });
                line.classList.add('center-line');
                scene.appendChild(line);
            }
        }
    }
});
