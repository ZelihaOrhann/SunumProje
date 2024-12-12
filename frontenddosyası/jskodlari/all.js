// Harita div'ine erişim
const mapDiv = document.getElementById('map');

// Sallanma animasyonunu tetikleyen bir fonksiyon
function triggerShakeAnimation() {
    mapDiv.classList.add('shake'); // Shake sınıfını ekle
    setTimeout(() => {
        mapDiv.classList.remove('shake'); // Animasyon bittiğinde sınıfı kaldır
    }, 500); // Animasyon süresiyle senkronize
}

// Örnek: Büyük bir deprem olduğunda animasyonu tetikleyin
earthquakeData.forEach(function (quake) {
    if (quake.magnitude >= 6) {
        setTimeout(triggerShakeAnimation, 1000); // 1 saniye gecikme ile tetikleyin
    }
});

/*---------------------------------------------------------------------------------------------------------------------------- */

/*nokta animasyonu */

earthquakeData.forEach(function (quake) {
    // Harita üzerine özel bir animasyonlu nokta eklemek için kullanılıyor
    let quakeDiv = L.divIcon({
        className: '', // Sınıf eklemiyoruz, sadece HTML oluşturuyoruz
        html: `<div class="earthquake-point" style="background-color: ${
            quake.magnitude >= 6 ? 'red' : quake.magnitude >= 4 ? 'orange' : 'yellow'
        };"></div>`,
        iconSize: [20, 20],
    });

    // Animasyonlu noktayı haritaya ekleyin
    L.marker([quake.lat, quake.lon], { icon: quakeDiv })
        .addTo(map)
        .bindPopup(`<b>${quake.location}</b><br>Magnitude: ${quake.magnitude}`);
});










map.setView([quake.lat, quake.lon], 8, { animate: true });


/*----------------------------------------------------------------------------------------------------*/

// GeoJSON verisini yüklemek için fetch kullanın
fetch('image/vktrrrr.geojson') // GeoJSON dosyasının doğru yolunu ekleyin
.then(response => response.json())  // JSON verisini çözümleyin
.then(data => {
    // GeoJSON verisini haritaya ekleyin
    L.geoJSON(data, {
        style: function() {
            return {
                color: 'green',  // Fay hattını kırmızı renkte göster
                weight: 1       // Çizgi kalınlığı
            };
        }
    }).addTo(map);  // Haritaya ekleyin
})
.catch(error => {
    console.log('GeoJSON verisi yüklenirken hata oluştu:', error);
});


/*------------------------------------------------------------------------------------*/


// Filtreleme panelini açma ve kapama fonksiyonu
function toggleFilter() {
    var filterPanel = document.getElementById('filterPanel');
    filterPanel.classList.toggle('open'); // Paneli açar veya kapatır
    var map = document.getElementById('map');
    map.classList.toggle('panel-open'); // Haritayı panel açıldığında sağa kaydırır
}

// Deprem verisini harita üzerinde göstermek için fonksiyon
function showEarthquakes(earthquakeData) {
    // Haritayı temizleyin
    map.eachLayer(function(layer) {
        if (layer instanceof L.Circle) {
            map.removeLayer(layer); // Yalnızca depremlerin gösterildiği daireleri kaldırır
        }
    });

    // Depremleri haritada göster
    earthquakeData.forEach(function (quake) {
        let color = quake.magnitude >= 6 ? 'red' :
                    quake.magnitude >= 4 ? 'orange' : 'yellow';

        L.circle([quake.lat, quake.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: quake.magnitude * 10000
        }).addTo(map)
          .bindPopup(`<b>${quake.location}</b><br>Magnitude: ${quake.magnitude}`);
    });
}

// Filtreleme işlemi
function applyFilter() {
    var location = document.getElementById('location').value.toLowerCase(); // Şehir adı
    var magnitudeRange = document.getElementById('magnitude-range').value; // Büyüklük aralığı

    // Deprem verisi
    const earthquakeData = [
        { lat: 38.9637, lon: 35.2433, magnitude: 3.5, location: "Ankara" },
        { lat: 37.0662, lon: 37.3833, magnitude: 5.2, location: "Gaziantep" },
        { lat: 40.9833, lon: 29.1167, magnitude: 6.3, location: "İstanbul" },
        { lat: 40.7306, lon: 29.981, magnitude: 4.0, location: "Bursa" }
    ];

    var filteredData = earthquakeData.filter(function (quake) {
        var show = true;

        // Şehir filtresi
        if (location && !quake.location.toLowerCase().includes(location)) {
            show = false;
        }

        // Büyüklük filtresi
        if (magnitudeRange === "low" && quake.magnitude >= 4) {
            show = false;
        } else if (magnitudeRange === "medium" && (quake.magnitude < 4 || quake.magnitude >= 6)) {
            show = false;
        } else if (magnitudeRange === "high" && quake.magnitude < 6) {
            show = false;
        }

        return show;
    });

    // Filtrelenmiş depremleri haritada göster
    showEarthquakes(filteredData);

    toggleFilter(); // Filtre panelini kapat
}

// Sıfırlama işlemi
function resetFilter() {
    // Tüm filtreleri sıfırlayın
    document.getElementById("magnitude-range").value = "all";
    document.getElementById("location").value = "";

    // Tüm veriyi tekrar göster
    const earthquakeData = [
        { lat: 38.9637, lon: 35.2433, magnitude: 3.5, location: "Ankara" },
        { lat: 37.0662, lon: 37.3833, magnitude: 5.2, location: "Gaziantep" },
        { lat: 40.9833, lon: 29.1167, magnitude: 6.3, location: "İstanbul" },
        { lat: 40.7306, lon: 29.981, magnitude: 4.0, location: "Bursa" }
    ];

    // Tüm depremleri haritada göster
    showEarthquakes(earthquakeData);

    // Filtreleme panelini kapat
    toggleFilter();
}





/*----------------------------------------------------------------------------------------------------------*/

// İkonlara erişim
const lowIcon = document.querySelector('.low');
const mediumIcon = document.querySelector('.medium');
const highIcon = document.querySelector('.high');

// Animasyonları ekleyen bir fonksiyon
function addDynamicEffect(icon, effectClass, duration = 3000) {
    icon.classList.add(effectClass); // Animasyon sınıfını ekle
    setTimeout(() => {
        icon.classList.remove(effectClass); // Belirtilen süre sonra kaldır
    }, duration);
}

// İkonlara fareyle üzerine gelindiğinde farklı animasyonlar ekleyin
lowIcon.addEventListener('mouseover', () => addDynamicEffect(lowIcon, 'bounce-effect', 2000));
mediumIcon.addEventListener('mouseover', () => addDynamicEffect(mediumIcon, 'bounce-effect', 2000));
highIcon.addEventListener('mouseover', () => addDynamicEffect(highIcon, 'bounce-effect', 2000));



/*---------------------------------------------------------------------------------------------------------------*/

function showUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            L.marker([userLat, userLon]).addTo(map)
                .bindPopup('Sizin Konumunuz')
                .openPopup();

            map.setView([userLat, userLon], 10); // Kullanıcı konumuna yakınlaştır
        });
    } else {
        alert("Tarayıcınız konum servislerini desteklemiyor.");
    }
}

// Sayfa yüklendiğinde çalıştır
showUserLocation();





// Harita oluşturma
var map = L.map('map').setView([39.9334, 32.8597], 6); // Türkiye koordinatları

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Deprem verilerini çekme
fetch('http://localhost:5000/api/earthquake/get-earthquake-data')
    .then(response => response.json())
    .then(data => {
        data.forEach(Earthquake => {
            const { lat, lng } = earthquake.coordinates;
            const marker = L.circleMarker([lat, lng], {
                radius: Earthquake.Magnitude * 2, // Büyüklüğe göre boyut
                color: Earthquake.Magnitude > 5 ? 'red' : (Earthquake.Magnitude > 4 ? 'orange' : 'yellow'),
                fillOpacity: 0.5
            }).addTo(map);

            marker.bindPopup(`Location: ${Earthquake.Location}<br>Magnitude: ${Earthquake.Magnitude}`);
        });
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
