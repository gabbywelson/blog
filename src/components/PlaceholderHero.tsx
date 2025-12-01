"use client";

interface PlaceholderHeroProps {
	title: string;
}

interface PlaceholderThumbProps {
	className?: string;
}

/**
 * Small thumbnail version of the botanical placeholder for post listings
 */
export function PlaceholderThumb({ className = "" }: PlaceholderThumbProps) {
	return (
		<svg
			viewBox="0 0 320 180"
			className={`w-full h-full ${className}`}
			preserveAspectRatio="xMidYMid slice"
		>
			<defs>
				<linearGradient id="thumb-sage" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#b8d4c8" />
					<stop offset="100%" stopColor="#8fb3a2" />
				</linearGradient>
				<linearGradient id="thumb-purple" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#d4c8e8" />
					<stop offset="100%" stopColor="#b8a8d4" />
				</linearGradient>
				<linearGradient id="thumb-teal" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#a4c3b2" />
					<stop offset="100%" stopColor="#7da891" />
				</linearGradient>
			</defs>

			<rect width="320" height="180" fill="#faf9f6" />

			{/* Corner trees - simplified arrangement */}
			<ellipse cx="25" cy="45" rx="30" ry="35" fill="url(#thumb-purple)" />
			<path d="M55 70 Q75 20 95 70 Z" fill="url(#thumb-sage)" />
			<ellipse cx="130" cy="40" rx="28" ry="32" fill="url(#thumb-teal)" />

			<ellipse cx="295" cy="50" rx="32" ry="38" fill="url(#thumb-sage)" />
			<path d="M240 65 Q260 18 280 65 Z" fill="url(#thumb-purple)" />
			<ellipse cx="200" cy="42" rx="26" ry="30" fill="url(#thumb-teal)" />

			{/* Bottom trees */}
			<ellipse cx="30" cy="165" rx="35" ry="40" fill="url(#thumb-teal)" />
			<path d="M70 180 Q90 130 110 180 Z" fill="url(#thumb-purple)" />
			<ellipse cx="160" cy="168" rx="30" ry="35" fill="url(#thumb-sage)" />
			<ellipse cx="220" cy="165" rx="28" ry="32" fill="url(#thumb-purple)" />
			<path d="M260 180 Q280 135 300 180 Z" fill="url(#thumb-teal)" />

			{/* Small flowers */}
			<circle cx="140" cy="85" r="4" fill="#fca5a5" />
			<circle cx="180" cy="90" r="3.5" fill="#c4b5fd" />
			<circle cx="100" cy="120" r="3" fill="#fcd34d" />
			<circle cx="220" cy="115" r="3.5" fill="#a5b4fc" />

			{/* Decorative star */}
			<polygon
				points="160,95 162,100 167,100 163,103 165,108 160,105 155,108 157,103 153,100 158,100"
				fill="#ffffff"
				opacity="0.85"
			/>
		</svg>
	);
}

export function PlaceholderHero({ title }: PlaceholderHeroProps) {
	return (
		<div className="relative w-full aspect-2/1 rounded-xl overflow-hidden bg-[#faf9f6]">
			<svg
				viewBox="0 0 800 400"
				className="w-full h-full"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					{/* Soft drop shadow for claymorphism effect */}
					<filter id="clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
						<feDropShadow
							dx="2"
							dy="4"
							stdDeviation="3"
							floodColor="#292524"
							floodOpacity="0.15"
						/>
					</filter>
					<filter
						id="clay-shadow-light"
						x="-20%"
						y="-20%"
						width="140%"
						height="140%"
					>
						<feDropShadow
							dx="1"
							dy="2"
							stdDeviation="2"
							floodColor="#292524"
							floodOpacity="0.1"
						/>
					</filter>

					{/* Gradient for depth on trees */}
					<linearGradient id="sage-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#b8d4c8" />
						<stop offset="100%" stopColor="#8fb3a2" />
					</linearGradient>
					<linearGradient
						id="sage-dark-gradient"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#7a9e8e" />
						<stop offset="100%" stopColor="#5c8070" />
					</linearGradient>
					<linearGradient
						id="purple-gradient"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#d4c8e8" />
						<stop offset="100%" stopColor="#b8a8d4" />
					</linearGradient>
					<linearGradient
						id="purple-dark-gradient"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#c4b5fd" />
						<stop offset="100%" stopColor="#a78bfa" />
					</linearGradient>
					<linearGradient id="teal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#a4c3b2" />
						<stop offset="100%" stopColor="#7da891" />
					</linearGradient>
				</defs>

				{/* Background */}
				<rect width="800" height="400" fill="#faf9f6" />

				{/* === TOP ROW OF TREES === */}
				{/* Top left corner trees */}
				<g filter="url(#clay-shadow)">
					{/* Conical tree */}
					<path d="M30 120 Q45 20 60 120 Z" fill="url(#sage-gradient)" />
					<rect x="40" y="120" width="10" height="15" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					{/* Round bush */}
					<ellipse
						cx="95"
						cy="100"
						rx="35"
						ry="40"
						fill="url(#purple-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					{/* Tall conical */}
					<path
						d="M130 130 Q155 10 180 130 Z"
						fill="url(#sage-dark-gradient)"
					/>
					<rect x="148" y="130" width="12" height="18" fill="#6B5344" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="220"
						cy="85"
						rx="40"
						ry="45"
						fill="url(#teal-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path
						d="M260 110 Q285 25 310 110 Z"
						fill="url(#purple-dark-gradient)"
					/>
					<rect x="278" y="110" width="10" height="14" fill="#8B6F5C" rx="2" />
				</g>

				{/* Top center trees */}
				<g filter="url(#clay-shadow)">
					<ellipse
						cx="355"
						cy="70"
						rx="32"
						ry="38"
						fill="url(#sage-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path d="M390 95 Q410 15 430 95 Z" fill="url(#teal-gradient)" />
					<rect x="404" y="95" width="9" height="12" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="470"
						cy="75"
						rx="35"
						ry="42"
						fill="url(#purple-gradient)"
					/>
				</g>

				{/* Top right trees */}
				<g filter="url(#clay-shadow)">
					<path
						d="M510 105 Q535 20 560 105 Z"
						fill="url(#sage-dark-gradient)"
					/>
					<rect x="528" y="105" width="11" height="15" fill="#6B5344" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="610"
						cy="80"
						rx="38"
						ry="44"
						fill="url(#teal-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path
						d="M650 120 Q680 30 710 120 Z"
						fill="url(#purple-dark-gradient)"
					/>
					<rect x="673" y="120" width="10" height="14" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="760"
						cy="90"
						rx="40"
						ry="48"
						fill="url(#sage-gradient)"
					/>
				</g>

				{/* === LEFT SIDE TREES === */}
				<g filter="url(#clay-shadow)">
					<ellipse
						cx="25"
						cy="180"
						rx="38"
						ry="45"
						fill="url(#teal-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path d="M55 250 Q80 160 105 250 Z" fill="url(#purple-gradient)" />
					<rect x="73" y="250" width="10" height="14" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="40"
						cy="320"
						rx="42"
						ry="50"
						fill="url(#sage-dark-gradient)"
					/>
				</g>

				{/* === RIGHT SIDE TREES === */}
				<g filter="url(#clay-shadow)">
					<ellipse
						cx="775"
						cy="175"
						rx="40"
						ry="48"
						fill="url(#purple-dark-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path d="M720 245 Q750 155 780 245 Z" fill="url(#sage-gradient)" />
					<rect x="742" y="245" width="11" height="16" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="765"
						cy="330"
						rx="45"
						ry="52"
						fill="url(#teal-gradient)"
					/>
				</g>

				{/* === BOTTOM ROW OF TREES === */}
				<g filter="url(#clay-shadow)">
					<ellipse
						cx="35"
						cy="390"
						rx="48"
						ry="55"
						fill="url(#purple-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path d="M85 400 Q115 310 145 400 Z" fill="url(#teal-gradient)" />
					<rect x="107" y="398" width="12" height="10" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="195"
						cy="385"
						rx="42"
						ry="50"
						fill="url(#sage-dark-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path
						d="M250 400 Q275 320 300 400 Z"
						fill="url(#purple-dark-gradient)"
					/>
					<rect x="268" y="398" width="10" height="8" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="360"
						cy="390"
						rx="45"
						ry="52"
						fill="url(#sage-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="440"
						cy="385"
						rx="38"
						ry="48"
						fill="url(#purple-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path d="M495 400 Q520 315 545 400 Z" fill="url(#teal-gradient)" />
					<rect x="512" y="398" width="11" height="8" fill="#8B6F5C" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="600"
						cy="390"
						rx="44"
						ry="52"
						fill="url(#sage-dark-gradient)"
					/>
				</g>

				<g filter="url(#clay-shadow)">
					<path
						d="M660 400 Q690 305 720 400 Z"
						fill="url(#purple-dark-gradient)"
					/>
					<rect x="682" y="398" width="12" height="8" fill="#6B5344" rx="2" />
				</g>

				<g filter="url(#clay-shadow)">
					<ellipse
						cx="775"
						cy="395"
						rx="50"
						ry="55"
						fill="url(#teal-gradient)"
					/>
				</g>

				{/* === SMALL FLOWERS scattered around === */}
				<g filter="url(#clay-shadow-light)">
					{/* Flower 1 - top left */}
					<circle cx="70" cy="145" r="5" fill="#fca5a5" />
					<circle cx="65" cy="140" r="3" fill="#fecaca" />
					<circle cx="75" cy="140" r="3" fill="#fecaca" />
					<circle cx="70" cy="135" r="3" fill="#fecaca" />
					<circle cx="65" cy="145" r="3" fill="#fecaca" />
					<circle cx="75" cy="145" r="3" fill="#fecaca" />
				</g>

				<g filter="url(#clay-shadow-light)">
					{/* Flower 2 - top right */}
					<circle cx="590" cy="130" r="4" fill="#c4b5fd" />
					<circle cx="586" cy="126" r="2.5" fill="#ddd6fe" />
					<circle cx="594" cy="126" r="2.5" fill="#ddd6fe" />
					<circle cx="586" cy="134" r="2.5" fill="#ddd6fe" />
					<circle cx="594" cy="134" r="2.5" fill="#ddd6fe" />
				</g>

				<g filter="url(#clay-shadow-light)">
					{/* Flower 3 - bottom left */}
					<circle cx="130" cy="365" r="5" fill="#fcd34d" />
					<circle cx="125" cy="360" r="3" fill="#fde68a" />
					<circle cx="135" cy="360" r="3" fill="#fde68a" />
					<circle cx="125" cy="370" r="3" fill="#fde68a" />
					<circle cx="135" cy="370" r="3" fill="#fde68a" />
				</g>

				<g filter="url(#clay-shadow-light)">
					{/* Flower 4 - bottom right */}
					<circle cx="670" cy="360" r="4" fill="#fca5a5" />
					<circle cx="666" cy="356" r="2.5" fill="#fecaca" />
					<circle cx="674" cy="356" r="2.5" fill="#fecaca" />
					<circle cx="666" cy="364" r="2.5" fill="#fecaca" />
					<circle cx="674" cy="364" r="2.5" fill="#fecaca" />
				</g>

				<g filter="url(#clay-shadow-light)">
					{/* Flower 5 - left side */}
					<circle cx="85" cy="280" r="4" fill="#a5b4fc" />
					<circle cx="81" cy="276" r="2.5" fill="#c7d2fe" />
					<circle cx="89" cy="276" r="2.5" fill="#c7d2fe" />
					<circle cx="81" cy="284" r="2.5" fill="#c7d2fe" />
					<circle cx="89" cy="284" r="2.5" fill="#c7d2fe" />
				</g>

				<g filter="url(#clay-shadow-light)">
					{/* Flower 6 - right side */}
					<circle cx="725" cy="290" r="5" fill="#fcd34d" />
					<circle cx="720" cy="285" r="3" fill="#fde68a" />
					<circle cx="730" cy="285" r="3" fill="#fde68a" />
					<circle cx="720" cy="295" r="3" fill="#fde68a" />
					<circle cx="730" cy="295" r="3" fill="#fde68a" />
				</g>

				{/* Small decorative stars */}
				<g filter="url(#clay-shadow-light)">
					<polygon
						points="755,380 757,385 762,385 758,388 760,393 755,390 750,393 752,388 748,385 753,385"
						fill="#ffffff"
						opacity="0.9"
					/>
				</g>

				<g filter="url(#clay-shadow-light)">
					<polygon
						points="320,75 322,80 327,80 323,83 325,88 320,85 315,88 317,83 313,80 318,80"
						fill="#ffffff"
						opacity="0.8"
					/>
				</g>
			</svg>

			{/* Title overlay in center */}
			<div className="absolute inset-0 flex items-center justify-center p-12">
				<h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#292524] leading-tight max-w-2xl">
					{title}
				</h1>
			</div>
		</div>
	);
}
