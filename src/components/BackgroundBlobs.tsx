export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-500">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 opacity-100 dark:opacity-30 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-black transition-colors duration-500" />
      
      {/* Soft floating gradient orbs in background */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-200/40 dark:bg-cyan-500/10 blur-[100px]" />
      <div className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-[120px]" />
      <div className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-brand-accent/30 dark:bg-brand-accent/5 blur-[90px]" />

      {/* 3D Floating Shapes */}
      {/* Top Right Sphere */}
      <div 
        className="absolute top-[10%] right-[5%] w-[120px] h-[120px] rounded-full opacity-80"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #d8b4fe 40%, #9333ea 80%, #581c87)',
          boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3), inset -10px -10px 20px rgba(0,0,0,0.1)'
        }}
      />

      {/* Center Left Sphere (Blurred for depth) */}
      <div 
        className="absolute top-[45%] -left-[5%] w-[180px] h-[180px] rounded-full opacity-60 blur-md"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #7dd3fc 40%, #0284c7 80%, #082f49)',
          boxShadow: '0 20px 40px rgba(2, 132, 199, 0.3)'
        }}
      />

      {/* Bottom Right Shape */}
      <div 
        className="absolute bottom-[15%] right-[10%] w-[90px] h-[90px] rounded-[30px] rotate-12 opacity-90"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #7c3aed 100%)',
          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3), inset 2px 2px 10px rgba(255,255,255,0.8), inset -5px -5px 15px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
}
