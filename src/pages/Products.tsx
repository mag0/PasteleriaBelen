import { useState, useEffect } from 'react';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import type { Product } from '../interfaces/Product';

const Products = () => {
  // Estado para los productos
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde el JSON
  useEffect(() => {
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el archivo de productos');
        return res.json();
      })
      .then((data) => {
        setProductsData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Categorías y ocasiones para filtrar
  const occasions = ['todas', 'cumpleaños', 'aniversario', 'eventos'];
  
  // Estados para los filtros
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeOccasion, setActiveOccasion] = useState('todas');
  const [showGlutenFree, setShowGlutenFree] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos según los criterios seleccionados
  const filteredProducts = productsData.filter(product => {
    // Filtro por categoría
    const categoryMatch = activeCategory === 'todas' || product.category === activeCategory;
    // Filtro por ocasión
    const occasionMatch = activeOccasion === 'todas' || product.occasion === activeOccasion;
    // Filtro por sin TACC
    const glutenFreeMatch = !showGlutenFree || product.glutenFree;
    // Filtro por término de búsqueda
    const searchMatch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && occasionMatch && glutenFreeMatch && searchMatch;
  });

  return (
    <div className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary">Nuestros Productos</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra variedad de productos artesanales elaborados con los mejores ingredientes y mucho amor.
          </p>
        </div>
        
        {/* Filtros */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Búsqueda */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Filtro por categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por ocasión */}
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
                Ocasión
              </label>
              <select
                id="occasion"
                value={activeOccasion}
                onChange={(e) => setActiveOccasion(e.target.value)}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {occasions.map(occasion => (
                  <option key={occasion} value={occasion}>
                    {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtro Sin TACC
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="glutenFree"
              checked={showGlutenFree}
              onChange={() => setShowGlutenFree(!showGlutenFree)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="glutenFree" className="ml-2 block text-sm text-gray-700">
              Mostrar solo productos Sin TACC
            </label>
          </div> */}
        </div>
        
        {/* Lista de productos */}
        {loading ? (
          <div className="text-center py-12">Cargando productos...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                category={product.category}
                glutenFree={product.glutenFree}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="mt-1 text-gray-500">Prueba con otros filtros o términos de búsqueda.</p>
            <div className="mt-6">
              <button 
                onClick={() => {
                  setActiveCategory('todas');
                  setActiveOccasion('todas');
                  setShowGlutenFree(false);
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
              >
                Restablecer filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;