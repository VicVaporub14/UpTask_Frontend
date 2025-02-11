import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
        <h1 className="font-black text-center text-white text-6xl">Error 404</h1>
        <h2 className="font-black text-center text-white text-4xl mt-10">Pagina no encontrada</h2>
        <p className="text-white mt-10 text-center">Tal vez quieras volver a {' '}
            <Link className="text-fuchsia-500" to={'/'} >Proyectos</Link>
        </p>
    </>
  )
}
