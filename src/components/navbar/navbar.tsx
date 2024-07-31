import { Search } from 'lucide-react'
import { memo } from 'react'

function Navbar() {
  return (
    <nav className="bg-[#0F172A] px-4 py-6 border-b-2 border-[#0a101d] shadow-md drop-shadow-md flex justify-between items-center"
    >
      <a href="/" className="text-white text-2xl font-bold flex gap-2 items-center">
        <img src="/logo.png" alt="React Filmes" className="w-12 h-12" />
        <h1 className="text-white text-2xl font-bold font-passion uppercase"
        >
          React Filmes {'\\>'}
        </h1></a>
      <form className="group bg-[#1E2A47] flex items-center">
        <input className="bg-[#1E2A47] text-white px-4 py-2 rounded-lg focus:outline-none"
          id="search"
          name="search"
          placeholder="Procurar"
        />
        <button title='Search' type='submit' className="text-white px-4 py-2 rounded-lg">
          <Search className='w-5 h-5' />
        </button>
      </form>
    </nav >
  )
}

export default memo(Navbar)
