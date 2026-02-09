import ScrollReveal from './ScrollReveal';

export default function PoweredBy() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="bg-brown-600 rounded-3xl px-8 py-12 lg:px-16 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
              {/* Left Side - Powered by */}
              <div className="flex flex-col items-center lg:items-end">
                <span className="text-cream-100/80 text-sm mb-2">Powered by</span>
                <div className="text-center lg:text-right">
                  <svg 
                    viewBox="0 0 80 60" 
                    className="h-16 w-auto mx-auto lg:mx-0"
                    fill="none"
                  >
                    <text
                      x="40"
                      y="35"
                      textAnchor="middle"
                      className="font-serif"
                      style={{ fontSize: '36px', fill: '#C9A87C', fontStyle: 'italic' }}
                    >
                      HJ
                    </text>
                  </svg>
                  <div className="text-cream-100/60 text-xs mt-1">
                    <div>Holistique Harmony</div>
                    <div>TRAINING</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-20 bg-cream-100/20" />

              {/* Right Side - Text */}
              <div className="text-center lg:text-left max-w-md">
                <p className="text-cream-100 text-lg leading-relaxed">
                  Our experts are carefully selected and professionally trained to ensure the highest service standards.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
