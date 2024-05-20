'use client'

import React, { useState, useEffect } from 'react';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';


interface Time {
    hours: number;
    minutes: number;
}

// Создание компонента React для калькулятора доставки
const MapComponent: React.FC = () => {
    // Состояния компонента
    const [map, setMap] = useState<L.Map | null>(null); // Kapтa
    const [startCoords] = useState<[number, number]>([56.4977000, 84.9744]); // Начальные координаты
    const [endMarker, setEndMarker] = useState<L.Marker | null>(null); // Маркер конечной точки
    const [distance, setDistance] = useState<number | null>(null); // Расстояние
    const [duration, setDuration] = useState<Time | null>(null); // Продолжительность
    const [deliveryCost, setDeliveryCost] = useState<number | null>(null); // Стоимость доставки
    const [mapDragged, setMapDragged] = useState<boolean>(false); // Флаг перетаскивания карты

    // Эффект для инициализации карты и ее настройки
    useEffect(() => {
        // Создание и настройка карты Leaflet
        const leafletMap = L.map('map', { attributionControl: false }).setView(startCoords, 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?apiKey=6d01be78a5a54efaa7db4b87de257cba', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 10,
        }).addTo(leafletMap);

        // Установка маркер стартовой точки
        const startIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1433/1433021.png',
            iconSize: [32, 32],
            iconAnchor: [32, 32]
        });
        L.marker(startCoords, { icon: startIcon }).addTo(leafletMap);

        // Установка созданной карты в состояние
        setMap(leafletMap);

        // Удаление карты при размонтировании компонента
        return () => {
            if (leafletMap) {
                leafletMap.remove();
            }
        };
    }, [startCoords]);

    // Эффект для обновления маршрута и вычисления стоимости доставки при изменении конечной точки
    useEffect(() => {
        if (!map || !endMarker) return;

        // Получение координат конечной точки
        const endCoords = endMarker.getLatLng();
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords.lng},${endCoords.lat}
        ?overview=full&geometries=geojson`;

        // Запрос для получения данных о маршруте
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Отображение маршрута на карте
                const routeLine = L.geoJSON(data.routes[0].geometry, {
                    style: {
                        color: 'blue'
                    }
                });
                map.eachLayer(layer => {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                });
                routeLine.addTo(map);
                map.fitBounds(routeLine.getBounds());

                // Вычисление расстояния и продолжительности маршрута
                const distance = data.routes[0].distance / 1000;
                const durationInMinutes = data.routes[0].duration / 60; // Продолжительность в минутах
                const durationWithAssembly = durationInMinutes + 120; // Добавление 2 часов на сборку
                const hours = Math.floor(durationWithAssembly / 60);
                const minutes = Math.floor(durationWithAssembly % 60);
                setDistance(distance);
                setDuration({ hours, minutes });

                // Обновление стоимости доставки
                updateDeliveryCost();
            })
            .catch(error => {
                console.error('Ошибка при получении маршрута:', error);
                alert('Ошибка при получении маршрута. Пожалуйста, попробуйте еще раз.');
            });
    }, [map, endMarker, startCoords]);

    // Обработчик события перетаскивания карты
    const handleMapDrag = () => {
        setMapDragged(true);
    };

    // Обработчик клика на карте
    const handleMapClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!map) return;

        // Если карта была перетащена, игнорируем установку метки
        if (mapDragged) {
            setMapDragged(false);
            return;
        }

        // Установка маркера конечной точки при клике на карте
        const { lat, lng } = map.mouseEventToLatLng(e.nativeEvent);
        const latlng = new LatLng(lat, lng);

        if (!endMarker) {
            const endIcon = L.icon({
                iconUrl: 'https://icon666.com/r/_thumb/6iv/6ivjcvs91m75_64.png',
                iconSize: [32, 32],
                iconAnchor: [32, 32],
            });
            const marker = L.marker(latlng, { icon: endIcon, draggable: true }).addTo(map!);
            marker.on('dragend', updateRoute);
            setEndMarker(marker);
        } else {
            endMarker.setLatLng(latlng);
            updateRoute();
        }
    };

    // Эффект для добавления обработчика перетаскивания карты
    useEffect(() => {
        if (map) {
            map.on('dragstart', handleMapDrag);
        }

        return () => {
            if (map) {
                map.off('dragstart', handleMapDrag);
            }
        };
    }, [map]);
    // Функция для обновления маршрута
    const updateRoute = () => {
        if (!map || !endMarker) return;

        // Удаление существующего маршрута
        map.eachLayer(layer => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        // Получение координат конечной точки маршрута
        const endCoords = endMarker.getLatLng();

        // Запрос на получение нового маршрута
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords.lng},${endCoords.lat}
        ?overview=full&geometries=geojson`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Отображение нового маршрута на карте
                const routeLine = L.geoJSON(data.routes[0].geometry, {
                    style: {
                        color: 'blue'
                    }
                });
                routeLine.addTo(map);
                map.fitBounds(routeLine.getBounds());

                // Обновление расстояния и продолжительности
                const distance = data.routes[0].distance / 1000;
                const durationInMinutes = data.routes[0].duration / 60; // Продолжительность в минутах
                const durationWithAssembly = durationInMinutes + 90; // Добавление 90 минут на сборку
                const hours = Math.floor(durationWithAssembly / 60);
                const minutes = Math.floor(durationWithAssembly % 60);
                setDistance(distance);
                setDuration({ hours, minutes });

                // Обновление стоимости доставки
                updateDeliveryCost();
            })
            .catch(error => {
                console.error('Ошибка при получении маршрута:', error);
                alert('Ошибка при получении маршрута. Пожалуйста, попробуйте еще раз.');
            });
    };

    // Обработчик изменения ввода данных пользователем
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRoute();
    };

    // Функция для обновления стоимости доставки
    const updateDeliveryCost = () => {
        let myInputElement = document.getElementById("myInput") as HTMLInputElement;
        let weightInputElement = document.getElementById("weightInput") as HTMLInputElement;
        let liftCheckboxElement = document.getElementById("liftCheckbox") as HTMLInputElement;

        let etazh = parseFloat(myInputElement.value);
        let weight = parseFloat(weightInputElement.value);
        let hasLift = liftCheckboxElement.checked;
        let distance = 0;

        if (!isNaN(etazh) && !isNaN(weight)) {
            if (hasLift) {
                etazh = 1;
            }
            let newDeliveryCost = distance * 35 + weight * 0.725 + (etazh * weight * 0.5);
            setDeliveryCost(newDeliveryCost);
        } else {
            setDeliveryCost(null);
        }
    };

    // Отрисовка компонента
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 2 }}>
                <h1 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Чтобы рассчитать стоимость доставки:</h1>
                <p style={{ marginBottom: '10px' }}>1. Поставьте метку на карте, куда необходима доставка.</p>
                <p style={{ marginBottom: '20px' }}>2. Укажите вес груза и этаж доставки, а также наличие лифта.</p>
                <div id="map" style={{ height: '550px', width: '800px', marginBottom: '20px' }} onClick={handleMapClick}></div>
            </div>
            <div style={{ flex: 1, marginLeft: '70px', paddingTop: '20px' }}>
                <div id="directions"></div>
                <span style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', display: 'block' }}>Калькулятор</span>
                <p style={{ marginTop: '10px' }}>
                    <label htmlFor="myInput">Введите ваш этаж:</label>
                    <input type="text" id="myInput" onChange={handleInputChange} style={{ width: '40px', height: '30px', borderRadius: '5px', textAlign: 'center', marginLeft: '10px' }} />
                </p>
                <p style={{ marginTop: '10px' }}>
                    <label htmlFor="weightInput">Введите вес груза (кг):</label>
                    <input type="text" id="weightInput" onChange={handleInputChange} style={{ width: '60px', height: '30px', borderRadius: '5px', textAlign: 'center', marginLeft: '10px' }} />
                </p>
                <p style={{ marginTop: '10px' }}>
                    <label htmlFor="liftCheckbox">Есть ли лифт?</label>
                    <input type="checkbox" id="liftCheckbox" onChange={handleInputChange} style={{ transform: 'scale(1.5)', marginLeft: '10px' }} />
                </p>
                <p style={{ marginTop: '20px' }}>Расстояние: {distance && distance.toFixed(2)} km</p>
                <p style={{ marginTop: '10px' }}>Примерное время доставки: {duration && `${duration.hours} ч ${duration.minutes} мин`}</p>
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Сумма доставки: {deliveryCost && deliveryCost.toFixed(2)} рублей</p>
            </div>
        </div>
    );
};


export default MapComponent;

 /* old map
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
        
        */

        /* new map 

        L.tileLayer('https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=6d01be78a5a54efaa7db4b87de257cba', {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
        maxZoom: 20, id: 'osm-bright'
        }).addTo(leafletMap);

        */