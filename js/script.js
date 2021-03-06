var map = new naver.maps.Map(document.getElementById('map'), {
    zoom: 7,
    mapTypeId: 'normal',
    center: new naver.maps.LatLng(36.4203004, 128.317960)
});

naver.maps.Event.once(map, 'init_stylemap', function () {
	// $.ajax({
	// 	url: 'https://raw.githubusercontent.com/vuski/admdongkor/master/ver20210701/HangJeongDong_ver20210701.geojson',
	// 	// url: 'https://navermaps.github.io/maps.js/docs/data/region09.json',
	// 	success: startDataLayer
	// })
	
	$.getJSON("../TL_SCCO_SIG.json", function(json) {
		startDataLayer(json);
	});
});

var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');

tooltip.appendTo(map.getPanes().floatPane);

function startDataLayer(geojson) {
	console.log(geojson);
    map.data.setStyle(function(feature) {
        var styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };

        if (feature.getProperty('focus')) {
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#0f0';
            styleOptions.strokeColor = '#0f0';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        }

        return styleOptions;
    });

    map.data.addGeoJson(geojson);

    map.data.addListener('click', function(e) {
        var feature = e.feature;

        if (feature.getProperty('focus') !== true) {
            feature.setProperty('focus', true);
        } else {
            feature.setProperty('focus', false);
        }
    });

    map.data.addListener('mouseover', function(e) {
        var feature = e.feature,
            regionName = feature.getProperty('SIG_KOR_NM');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);

        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    map.data.addListener('mouseout', function(e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });
}