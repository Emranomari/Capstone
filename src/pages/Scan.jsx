import { useState, useRef, useEffect } from 'react'
import { usePatients } from '../context/PationtsContext'
import { useToast } from '../context/ToastContext'

export default function Scan() {
  const { addPatient } = usePatients()
  const { addToast }   = useToast()

  const [form, setForm] = useState({
    name: '', age: '', phone: '', date: '', side: '',
  })
  const [image,   setImage]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const fileInputRef = useRef(null)
  const canvasRef    = useRef(null)

  useEffect(() => {
    if (!result || !canvasRef.current || !preview) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const img    = new Image()

    img.onload = () => {
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      result.boxes.forEach(box => {
        ctx.strokeStyle = '#EF4444'
        ctx.lineWidth   = Math.max(img.naturalWidth / 200, 3)
        ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1)

        const label    = `${Math.round(box.score * 100)}%`
        const fontSize = Math.max(img.naturalWidth / 40, 14)
        ctx.font       = `bold ${fontSize}px sans-serif`
        ctx.fillStyle  = '#EF4444'
        ctx.fillText(label, box.x1 + 4, box.y1 - 6)
      })
    }

    img.src = preview
  }, [result, preview])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAnalyze = async () => {
    if (!form.name || !form.age || !form.phone || !form.date || !form.side) {
      setError('Please fill in all patient information')
      return
    }
    if (!image) {
      setError('Please upload a mammogram image')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body:   formData,
      })

      if (!response.ok) throw new Error('Server error')

      const data = await response.json()

      const isPositive = data.boxes.length > 0
      const topScore   = isPositive
        ? Math.round(Math.max(...data.boxes.map(b => b.score)) * 100)
        : null

      const finalResult = {
        result:     isPositive ? 'Positive' : 'Negative',
        confidence: topScore,
        boxes:      data.boxes,
        message:    isPositive
          ? `${data.boxes.length} suspicious region${data.boxes.length > 1 ? 's' : ''} detected. Immediate radiologist review recommended.`
          : 'No suspicious regions detected. Routine follow-up advised.',
      }

      setResult(finalResult)

      addPatient({
        name:       form.name,
        age:        parseInt(form.age),
        phone:      form.phone,
        date:       form.date,
        side:       form.side,
        result:     finalResult.result,
        confidence: finalResult.confidence,
      })

      addToast(
        isPositive
          ? `Positive — ${data.boxes.length} region${data.boxes.length > 1 ? 's' : ''} detected`
          : 'Negative — No suspicious regions found',
        isPositive ? 'error' : 'success'
      )

    } catch (err) {
      setError('Failed to connect to the analysis server. Make sure the backend is running on port 8000.')
      addToast('Connection failed. Is the backend running?', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ name: '', age: '', phone: '', date: '', side: '' })
    setImage(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">

      <div>
        <h1 className="text-lg font-medium text-gray-800">New Scan</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Upload a mammogram image and fill in patient details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* LEFT */}
        <div className="space-y-4">

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Patient information</p>
            <div className="space-y-3">

              <div>
                <label className="block text-xs text-gray-400 mb-1">Full name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleFormChange} placeholder="Sara Ahmad"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                             focus:outline-none focus:border-sky-400 focus:ring-2
                             focus:ring-sky-100 placeholder:text-gray-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Age</label>
                  <input
                    type="number" name="age" value={form.age}
                    onChange={handleFormChange} placeholder="47" min="1" max="120"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               focus:outline-none focus:border-sky-400 focus:ring-2
                               focus:ring-sky-100 placeholder:text-gray-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel" name="phone" value={form.phone}
                    onChange={handleFormChange} placeholder="079xxxxxxx"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               focus:outline-none focus:border-sky-400 focus:ring-2
                               focus:ring-sky-100 placeholder:text-gray-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Scan date</label>
                <input
                  type="date" name="date" value={form.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                             focus:outline-none focus:border-sky-400 focus:ring-2
                             focus:ring-sky-100 text-gray-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Breast side</label>
                <div className="grid grid-cols-2 gap-2">
                  {['L', 'R'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setForm({ ...form, side: s })}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all
                        ${form.side === s
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300'
                        }`}
                    >
                      {s === 'L' ? 'Left' : 'Right'}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Mammogram image</p>
            <div
              onDrop={handleDrop} onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                          transition-all
                          ${preview
                            ? 'border-sky-300 bg-sky-50'
                            : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                          }`}
            >
              {preview ? (
                <img src={preview} alt="preview"
                  className="max-h-36 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl text-gray-300">↑</div>
                  <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-300">PNG, JPG, DCM</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange}
              accept="image/*" className="hidden" />
            {preview && (
              <button
                onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null) }}
                className="mt-2 w-full text-xs text-gray-400 hover:text-red-500
                           transition-colors py-1"
              >
                Remove image
              </button>
            )}
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Analysis</p>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-xs
                              rounded-lg px-3 py-2.5 mb-3">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze} disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all
                ${loading
                  ? 'bg-sky-100 text-sky-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-sky-300 border-t-transparent
                                   rounded-full animate-spin"/>
                  Analyzing...
                </span>
              ) : 'Analyze mammogram'}
            </button>

            <p className="text-xs text-gray-300 text-center mt-2">
              Powered by Faster R-CNN model
            </p>
          </div>

          {result && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
              <p className="text-sm font-medium text-gray-700">Results</p>

              <div className={`rounded-xl p-4 text-center
                ${result.result === 'Positive'
                  ? 'bg-red-50 border border-red-100'
                  : 'bg-green-50 border border-green-100'
                }`}>
                <p className={`text-xl font-medium
                  ${result.result === 'Positive' ? 'text-red-600' : 'text-green-600'}`}>
                  {result.result}
                </p>
                {result.confidence && (
                  <p className={`text-xs mt-1
                    ${result.result === 'Positive' ? 'text-red-400' : 'text-green-400'}`}>
                    Confidence: {result.confidence}%
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1.5 text-center">
                  {result.result === 'Positive' ? 'Detected regions' : 'Mammogram'}
                </p>
                <div className="rounded-lg overflow-hidden border border-gray-100">
                  <canvas ref={canvasRef} className="w-full h-auto object-contain"/>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 leading-relaxed">{result.message}</p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 rounded-lg border border-gray-200 text-sm
                           text-gray-500 hover:bg-gray-50 transition-colors"
              >
                New scan
              </button>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
              <div className="text-4xl text-gray-200 mb-3">◎</div>
              <p className="text-sm text-gray-400">
                Results will appear here after analysis
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}