import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from "leaflet";
interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface UF {
    sigla: string;
}
interface City {
    nome: string;
}
function CreatePoint() {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState("0");
    const [city, setcity] = useState<string[]>([]);
    const [selectedCity, setselectedCity] = useState("0");
    const [selectedPosition, setselectedPosition] = useState<[number, number]>([0, 0]);
    const [inittialsPosition, setinittialsPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: ""
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const history = useHistory();
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {

        axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);
    useEffect(() => {
        if (selectedUF === '0') { return; }
        axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            console.log(response);
            const CityNames = response.data.map(city => city.nome);
            setcity(CityNames);
        });
    }, [selectedUF]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setinittialsPosition([latitude, longitude]);
        });

    }, []);
    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUF(uf);
    }

    function handleSelectedCITY(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setselectedCity(city);
    }
    function handleMapClick(event: LeafletMouseEvent) {
        setselectedPosition([
            event.latlng.lat,
            event.latlng.lng

        ]);
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }
    function handleSelectedITEM(id: number) {
        const alreadyselected = selectedItems.findIndex(item => item == id);
        if (alreadyselected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);

        } else {
            setSelectedItems([...selectedItems, id]);
        }


    }
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = { name, email, whatsapp, uf, city, latitude, longitude, items };
        await api.post('points', data);
        alert("Ponto Criado!");
        history.push('/')
    }
    return (

        <div id="page-create-point">

            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                 Voltar para home</Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend><h2>Dados</h2></legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend><h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={inittialsPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select
                                value={selectedUF}
                                name="uf" id="uf"
                                onChange={handleSelectedUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (

                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                onChange={handleSelectedCITY}
                                value={selectedCity}
                                name="city" id="city">
                                <option value="0">Selecione uma Cidade</option>
                                {city.map(cities => (

                                    <option key={cities} value={cities}>{cities}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend><h2>Items de coleta</h2>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}
                                onClick={() => handleSelectedITEM(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ""}

                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}


                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    );
}
export default CreatePoint;