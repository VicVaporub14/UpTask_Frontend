
export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className="bg-red-100 text-red-600 w-full py-3 rounded font-bold text-center">
        {children}
    </div>
  )
}
