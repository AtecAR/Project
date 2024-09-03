document.addEventListener('DOMContentLoaded', () => {
    const markerContainer = document.getElementById('markers');
    const markers = [];

    // マーカーを20個追加 (pattファイルの名前は適宜調整してください)
    for (let i = 1; i <= 20; i++) {
        const marker = document.createElement('a-marker');
        marker.setAttribute('type', 'pattern');
        marker.setAttribute('url', `marker/mark_id_${i}.patt`);
        marker.setAttribute('id', `marker${i}`);
        marker.addEventListener('markerFound', onMarkerFound);
        marker.addEventListener('markerLost', onMarkerLost);
        markerContainer.appendChild(marker);
        markers.push(marker);
    }

    // マーカーが検出された時の処理
    function onMarkerFound(evt) {
        const marker = evt.target;

        // マーカーの座標を取得して点をプロット
        plotMarkerPoints(marker);

        // 同一マーカーを結ぶ直線を描画
        drawConnectingLine(marker);
    }

    // マーカーが見失われた時の処理
    function onMarkerLost(evt) {
        // ここで処理を行う場合は記載
    }

    // マーカーの中心点と頂点をプロットする関数
    function plotMarkerPoints(marker) {
        const markerPos = marker.object3D.position;

        // 中心点（赤点）
        createDot(markerPos, 'redDot', marker);

        // 頂点（緑点）
        const size = 0.08; // マーカーの大きさ
        const vertices = [
            { x: -size, y: size, z: 0 },
            { x: size, y: size, z: 0 },
            { x: size, y: -size, z: 0 },
            { x: -size, y: -size, z: 0 }
        ];
        
        vertices.forEach(vertex => {
            const vertexPos = markerPos.clone().add(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
            createDot(vertexPos, 'greenDot', marker);
        });
    }

    // 点を作成する関数
    function createDot(position, templateId, parent) {
        const dot = document.createElement('a-sphere');
        dot.setAttribute('position', position);
        dot.setAttribute('radius', 0.01);
        dot.setAttribute('color', templateId === 'redDot' ? 'red' : 'green');
        parent.appendChild(dot);
    }

    // 同一マーカーを結ぶ直線を描画する関数
    function drawConnectingLine(marker) {
        const markerPos = marker.object3D.position;
        markers.forEach(otherMarker => {
            if (otherMarker !== marker && otherMarker.object3D.visible) {
                const otherPos = otherMarker.object3D.position;
                createLine(markerPos, otherPos, marker);
            }
        });
    }

    // 線を作成する関数
    function createLine(startPos, endPos, parent) {
        const line = document.createElement('a-entity');
        line.setAttribute('line', {
            start: startPos,
            end: endPos,
            color: 'blue'
        });
        parent.appendChild(line);
    }
});
