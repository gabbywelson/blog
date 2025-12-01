import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title") || "Gabby's Garden";

	// Load Fraunces font
	const frauncesData = await fetch(
		new URL(
			"https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIctxujDvTShUtWNg.woff2",
			request.url,
		),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#faf9f6",
				position: "relative",
			}}
		>
			{/* SVG Background with botanical elements */}
			<svg
				width="1200"
				height="630"
				viewBox="0 0 1200 630"
				style={{ position: "absolute", top: 0, left: 0 }}
			>
				<defs>
					{/* Gradients for trees */}
					<linearGradient id="sage" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#b8d4c8" />
						<stop offset="100%" stopColor="#8fb3a2" />
					</linearGradient>
					<linearGradient id="sageDark" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#7a9e8e" />
						<stop offset="100%" stopColor="#5c8070" />
					</linearGradient>
					<linearGradient id="purple" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#d4c8e8" />
						<stop offset="100%" stopColor="#b8a8d4" />
					</linearGradient>
					<linearGradient id="purpleDark" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#c4b5fd" />
						<stop offset="100%" stopColor="#a78bfa" />
					</linearGradient>
					<linearGradient id="teal" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#a4c3b2" />
						<stop offset="100%" stopColor="#7da891" />
					</linearGradient>
				</defs>

				{/* Background */}
				<rect width="1200" height="630" fill="#faf9f6" />

				{/* === TOP ROW OF TREES === */}
				{/* Top left corner trees */}
				<ellipse cx="45" cy="100" rx="55" ry="65" fill="url(#purple)" />
				<path d="M100 150 Q135 30 170 150 Z" fill="url(#sage)" />
				<rect x="127" y="150" width="14" height="20" fill="#8B6F5C" rx="3" />
				<ellipse cx="230" cy="90" rx="50" ry="60" fill="url(#teal)" />
				<path d="M290 140 Q330 40 370 140 Z" fill="url(#purpleDark)" />
				<rect x="318" y="140" width="14" height="18" fill="#8B6F5C" rx="3" />
				<ellipse cx="430" cy="85" rx="45" ry="55" fill="url(#sageDark)" />

				{/* Top center */}
				<path d="M500 120 Q540 25 580 120 Z" fill="url(#purple)" />
				<rect x="530" y="120" width="12" height="16" fill="#8B6F5C" rx="2" />
				<ellipse cx="650" cy="90" rx="50" ry="60" fill="url(#teal)" />
				<path d="M720 130 Q760 35 800 130 Z" fill="url(#sage)" />
				<rect x="750" y="130" width="14" height="18" fill="#8B6F5C" rx="3" />

				{/* Top right corner */}
				<ellipse cx="880" cy="95" rx="55" ry="65" fill="url(#purpleDark)" />
				<path d="M950 150 Q990 40 1030 150 Z" fill="url(#sageDark)" />
				<rect x="980" y="150" width="15" height="20" fill="#6B5344" rx="3" />
				<ellipse cx="1120" cy="100" rx="60" ry="70" fill="url(#teal)" />

				{/* === LEFT SIDE TREES === */}
				<path d="M20 230 Q60 130 100 230 Z" fill="url(#sage)" />
				<rect x="50" y="230" width="14" height="18" fill="#8B6F5C" rx="3" />
				<ellipse cx="50" cy="310" rx="60" ry="70" fill="url(#purpleDark)" />
				<path d="M30 420 Q70 330 110 420 Z" fill="url(#teal)" />
				<rect x="60" y="418" width="14" height="16" fill="#8B6F5C" rx="3" />
				<ellipse cx="45" cy="510" rx="65" ry="75" fill="url(#sageDark)" />

				{/* === RIGHT SIDE TREES === */}
				<path d="M1100 220 Q1140 130 1180 220 Z" fill="url(#purpleDark)" />
				<rect x="1130" y="220" width="14" height="18" fill="#8B6F5C" rx="3" />
				<ellipse cx="1150" cy="310" rx="60" ry="70" fill="url(#sage)" />
				<path d="M1100 410 Q1140 320 1180 410 Z" fill="url(#teal)" />
				<rect x="1130" y="408" width="14" height="16" fill="#8B6F5C" rx="3" />
				<ellipse cx="1155" cy="510" rx="65" ry="75" fill="url(#purple)" />

				{/* === BOTTOM ROW OF TREES === */}
				<ellipse cx="55" cy="610" rx="70" ry="80" fill="url(#purple)" />
				<path d="M130 630 Q170 540 210 630 Z" fill="url(#sageDark)" />
				<rect x="160" y="628" width="14" height="10" fill="#8B6F5C" rx="2" />
				<ellipse cx="290" cy="605" rx="60" ry="70" fill="url(#teal)" />
				<path d="M370 630 Q410 545 450 630 Z" fill="url(#purpleDark)" />
				<rect x="400" y="628" width="14" height="10" fill="#8B6F5C" rx="2" />
				<ellipse cx="530" cy="610" rx="55" ry="65" fill="url(#sage)" />
				<ellipse cx="640" cy="605" rx="50" ry="60" fill="url(#purple)" />
				<path d="M720 630 Q760 540 800 630 Z" fill="url(#teal)" />
				<rect x="750" y="628" width="14" height="10" fill="#8B6F5C" rx="2" />
				<ellipse cx="880" cy="610" rx="60" ry="70" fill="url(#sageDark)" />
				<path d="M970 630 Q1010 545 1050 630 Z" fill="url(#purpleDark)" />
				<rect x="1000" y="628" width="14" height="10" fill="#6B5344" rx="2" />
				<ellipse cx="1145" cy="615" rx="75" ry="85" fill="url(#teal)" />

				{/* === SMALL FLOWERS === */}
				{/* Flower 1 - coral */}
				<circle cx="145" cy="200" r="8" fill="#fca5a5" />
				<circle cx="137" cy="193" r="5" fill="#fecaca" />
				<circle cx="153" cy="193" r="5" fill="#fecaca" />
				<circle cx="137" cy="207" r="5" fill="#fecaca" />
				<circle cx="153" cy="207" r="5" fill="#fecaca" />

				{/* Flower 2 - purple */}
				<circle cx="1050" cy="195" r="7" fill="#c4b5fd" />
				<circle cx="1043" cy="188" r="4.5" fill="#ddd6fe" />
				<circle cx="1057" cy="188" r="4.5" fill="#ddd6fe" />
				<circle cx="1043" cy="202" r="4.5" fill="#ddd6fe" />
				<circle cx="1057" cy="202" r="4.5" fill="#ddd6fe" />

				{/* Flower 3 - yellow bottom left */}
				<circle cx="180" cy="555" r="8" fill="#fcd34d" />
				<circle cx="172" cy="547" r="5" fill="#fde68a" />
				<circle cx="188" cy="547" r="5" fill="#fde68a" />
				<circle cx="172" cy="563" r="5" fill="#fde68a" />
				<circle cx="188" cy="563" r="5" fill="#fde68a" />

				{/* Flower 4 - coral bottom right */}
				<circle cx="1010" cy="550" r="7" fill="#fca5a5" />
				<circle cx="1003" cy="543" r="4.5" fill="#fecaca" />
				<circle cx="1017" cy="543" r="4.5" fill="#fecaca" />
				<circle cx="1003" cy="557" r="4.5" fill="#fecaca" />
				<circle cx="1017" cy="557" r="4.5" fill="#fecaca" />

				{/* Flower 5 - blue left */}
				<circle cx="120" cy="380" r="7" fill="#a5b4fc" />
				<circle cx="113" cy="373" r="4.5" fill="#c7d2fe" />
				<circle cx="127" cy="373" r="4.5" fill="#c7d2fe" />
				<circle cx="113" cy="387" r="4.5" fill="#c7d2fe" />
				<circle cx="127" cy="387" r="4.5" fill="#c7d2fe" />

				{/* Flower 6 - yellow right */}
				<circle cx="1085" cy="390" r="8" fill="#fcd34d" />
				<circle cx="1077" cy="382" r="5" fill="#fde68a" />
				<circle cx="1093" cy="382" r="5" fill="#fde68a" />
				<circle cx="1077" cy="398" r="5" fill="#fde68a" />
				<circle cx="1093" cy="398" r="5" fill="#fde68a" />

				{/* Decorative stars */}
				<polygon
					points="1120,570 1124,580 1134,580 1126,586 1130,596 1120,590 1110,596 1114,586 1106,580 1116,580"
					fill="#ffffff"
					opacity="0.9"
				/>
				<polygon
					points="480,110 483,118 491,118 485,123 488,131 480,126 472,131 475,123 469,118 477,118"
					fill="#ffffff"
					opacity="0.85"
				/>
			</svg>

			{/* Title overlay */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "80px 120px",
					textAlign: "center",
					zIndex: 10,
				}}
			>
				<span
					style={{
						fontFamily: "Fraunces",
						fontSize: title.length > 50 ? 48 : title.length > 30 ? 56 : 72,
						fontWeight: 700,
						color: "#292524",
						lineHeight: 1.2,
						maxWidth: "900px",
					}}
				>
					{title}
				</span>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Fraunces",
					data: frauncesData,
					style: "normal",
					weight: 700,
				},
			],
		},
	);
}
