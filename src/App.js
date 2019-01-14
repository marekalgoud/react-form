import React, { Component } from 'react';
import Brand from './Brand';
import Tyre from './Tyre';
import './App.css';
import axios from 'axios';

class App extends Component {

  state = {
    filter: '',
    brands: [],
    tyres: [],
    error: false
  }
  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value })
  }

  handleBrandClick = (id) => {
    const brands = [...this.state.brands];
    // check if brand is deletable
    if (!this.state.tyres.find(tyre => tyre.brandId === id)) {
      const indexToRemove = brands.findIndex(brand => brand.id === id);
      brands.splice(indexToRemove, 1);
      axios.delete(`/api/brands/${id}`)
      this.setState({
        brands
      })
    } else {
      alert('la marque est reliée à au moins un pneu, elle ne peut pas être supprimée')
    }
  }

  componentDidMount () {
    axios.get('/api/brands')
      .then(response => {
        const brands = response.data;
        this.setState({ brands });
      })
      .catch(error => {
        this.setState({ error: true });
      });

      axios.get('/api/tyres')
      .then(response => {
        const tyres = response.data;
        this.setState({ tyres });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  render () {
    const brands = this.state.brands.map(brand => (
      <Brand data={brand} key={brand.id} click={() => this.handleBrandClick(brand.id)} />
    ));

    const tyres = this.state.tyres
      .filter(tyre => tyre.name.toLowerCase().includes(this.state.filter.toLowerCase()))
      .map(tyre => {
        const brand = this.state.brands.find(brand => brand.id === tyre.brandId);
        tyre.brand = brand ? brand : '';
        return tyre;
      })
      .map(tyreWithBrand => {
        return <Tyre data={tyreWithBrand} key={tyreWithBrand.id} />
      });
    return (
      <div className="App">
        <div className="intro">
          <h1>But de l'exercice :</h1>
          <ol>
            <li>Créer un répertoire "component" et des sous répertoires pour "ranger" nos composants</li>
            <li>Faire deux nouveaux composants : BrandList et TyreList</li>
            <li>reprendre tous les concepts vue jusqu'à maintenant : PureComponent, Fragment, Props-type sur Brand et Tyre, Portal et focus sur le champ de recherche</li>
            <li>Refactoriser le code</li>
          </ol>
        </div>
        {this.state.error ? 'Une erreur est survenue...' : null}
        <h2> Liste des marques</h2>
        {brands}
        <h2> Liste des pneus</h2>
        <input type="text" onChange={this.handleFilterChange} />
        {tyres}
      </div>
    );
  }
}

export default App;
