/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Define interfaces for our data structures
interface UserData {
    name: string;
    email: string;
    nib: string;
}

interface AnalysisResult {
    hsCode: string;
    description: string;
}

interface MarketData {
    country: string;
    annualImport: string;
    cagr: string;
    tariff: string;
    preferences: string;
    marketPrice: string;
    marketPriceTerm: string;
    sourceUrl: string;
    localMarketplaces?: string[];
}

interface RegulationData {
    documents: string[];
    tariffs: string[];
    standards: string[];
}

interface MarketingTips {
    platforms: string[];
    contentStrategy: string[];
    influencerTips: string[];
    paidAds: string[];
}

interface GlossarySubItem {
    name: string;
    detail: string;
}

interface GlossaryTerm {
    term: string;
    definition: string;
    subItems?: GlossarySubItem[];
}

const tradeRepresentatives = [
  { office: "ITPC Milan", country: "Italia", email: "info@itpcmilan.it", website: "https://itpcmilan.it/id/", instagram: "@itpc.milan" },
  { office: "ITPC Sydney", country: "Australia", email: "marketing@itpcsydney.com", website: "https://itpcsydney.com/", instagram: "@itpc_sydney" },
  { office: "ITPC Osaka", country: "Jepang", email: "osaka@itpc.or.jp", website: "https://itpc.or.jp/", instagram: "@itpc.osaka" },
  { office: "ITPC Chennai", country: "India", email: "itpc.chennai@kemendag.go.id", website: "https://itpcchennai.com/", instagram: "@itpcchennai" },
  { office: "ITPC Johannesburg", country: "Afrika Selatan", email: "johannesburg@kemendag.go.id", website: "https://itpcjhb.com/", instagram: "@itpc_johannesburg" },
  { office: "ITPC Lagos", country: "Nigeria", email: "itpc.lagos@kemendag.go.id", website: "https://itpclagos.org/", instagram: "@itpc.lagos" },
  { office: "ITPC Chicago", country: "Amerika Serikat", email: "itpc.chicago@kemendag.go.id", website: "https://www.itpcchicago.com/", instagram: "@itpcchicago" },
  { office: "ITPC Los Angeles", country: "Amerika Serikat", email: "itpc.la@kemendag.go.id", website: "https://itpc-losangeles.com/", instagram: "@itpclalosangeles" },
  { office: "ITPC Santiago", country: "Chili", email: "itpcsantiago@kemendag.go.id", website: "https://itpcsantiago.cl/", instagram: "@itpcsantiago" },
  { office: "ITPC Sao Paulo", country: "Brasil", email: "itpc.saopaulo@kemendag.go.id", website: "https://itpcsaopaulo.com/", instagram: "@itpcsaopaulo" },
  { office: "ITPC Vancouver", country: "Kanada", email: "vancouver@itpc-canada.com", website: "https://itpcvancouver.com/", instagram: "@itpcvancouver_ca" },
  { office: "ITPC Barcelona", country: "Spanyol", email: "itpc.barcelona@kemendag.go.id", website: "https://itpc-barcelona.es/en", instagram: "@itpcbarcelona" },
  { office: "ITPC Budapest", country: "Hungaria", email: "itpcbudapest@kemendag.go.id", website: "https://www.itpc-bud.hu/", instagram: "@itpcbudapest" },
  { office: "ITPC Hamburg", country: "Jerman", email: "info@itpchamburg.de", website: "https://itpchamburg.de/", instagram: "@itpchamburg" },
  { office: "KDEI Taipei", country: "Taiwan", email: "kdei@kdei-taipei.org", website: "https://kdei-taipei.org/", instagram: "@kdeitaipei" },
  { office: "ITPC Busan", country: "Korea Selatan", email: "itpc-kor@kemendag.go.id", website: "https://itpc-busan.kr/", instagram: "@itpcbusan" },
  { office: "ITPC Jeddah", country: "Arab Saudi", email: "itpc.jeddah@gmail.com", website: "http://itpc-jeddah.sa/", instagram: "@itpc.jeddah" },
  { office: "ITPC Dubai", country: "Uni Emirat Arab", email: "itpc.dubai@kemendag.go.id", website: "https://itpcdubai.id/", instagram: "@itpc.dubai" },
  { office: "ITPC Shanghai", country: "Tiongkok", email: "itpc.shanghai@kemendag.go.id", website: "https://itpcshanghai.com/", instagram: "@itpc.shanghai" },
  { office: "ITPC Mexico City", country: "Meksiko", email: "info@itpcmexicocity.mx", website: "https://www.itpccdmx.mx/", instagram: "@itpcmexicocity" },
  { office: "Atase Perdagangan Tokyo", country: "Jepang", email: "atdag.tokyo@kemendag.go.id", website: "https://kemlu.go.id/tokyo", instagram: "@atdag_tokyo" },
  { office: "Atase Perdagangan Washington DC", country: "Amerika Serikat", email: null, website: "https://kemlu.go.id/washington", instagram: "@tradeattachedc" },
  { office: "Atase Perdagangan Bangkok", country: "Thailand", email: "atdag.bangkok@kemendag.go.id", website: "https://kemlu.go.id/bangkok", instagram: "@ataseperdaganganbangkok" },
  { office: "Atase Perdagangan Beijing", country: "Tiongkok", email: "atdag.beijing@kemendag.go.id", website: "https://kemlu.go.id/beijing", instagram: "@atdagitpc.china" },
  { office: "Atase Perdagangan Berlin", country: "Jerman", email: "atdag.berlin@kemendag.go.id", website: "https://kemlu.go.id/berlin", instagram: "@indonesiainberlin" },
  { office: "Atase Perdagangan Brussels", country: "Belgia", email: "atdag.brussels@kemendag.go.id", website: "https://kemlu.go.id/brussel", instagram: "@indonesiainbrussels" },
  { office: "Atase Perdagangan Ankara", country: "Turki", email: null, website: "https://kemlu.go.id/ankara", instagram: "@endonezya.ticaret" },
  { office: "Atase Perdagangan Kairo", country: "Mesir", email: null, website: "https://kemlu.go.id/cairo", instagram: "@cairo.atdag" },
  { office: "Atase Perdagangan Canberra", country: "Australia", email: null, website: "https://kemlu.go.id/canberra", instagram: "@atdag_canberra" },
  { office: "Atase Perdagangan Den Haag", country: "Belanda", email: null, website: "https://kemlu.go.id/denhaag", instagram: "@atdag_denhaag" },
  { office: "Atase Perdagangan Hanoi", country: "Vietnam", email: null, website: "https://kemlu.go.id/hanoi", instagram: "@atdag.hanoi" },
  { office: "Atase Perdagangan Jenewa", country: "Swiss", email: null, website: "https://www.kemendag.go.id/atase-itpc", instagram: "@atdag.jenewa" },
  { office: "Atase Perdagangan Kuala Lumpur", country: "Malaysia", email: null, website: "https://kemlu.go.id/kualalumpur", instagram: "@atdag.kualalumpur" },
  { office: "Atase Perdagangan London", country: "Inggris Raya", email: null, website: "https://kemlu.go.id/london", instagram: "@indonesiainlondon" },
  { office: "Atase Perdagangan Madrid", country: "Spanyol", email: null, website: "https://kemlu.go.id/madrid", instagram: "@atdag_madrid" },
  { office: "Atase Perdagangan Manila", country: "Filipina", email: null, website: "https://kemlu.go.id/manila", instagram: "@atdagmanillaofficial" },
  { office: "Atase Perdagangan Moskow", country: "Rusia", email: null, website: "https://kemlu.go.id/moscow", instagram: "@atdag.moskow" },
  { office: "Atase Perdagangan New Delhi", country: "India", email: null, website: "https://kemlu.go.id/newdelhi", instagram: "@atdagnewdelhi" },
  { office: "Atase Perdagangan Ottawa", country: "Kanada", email: null, website: "https://kemlu.go.id/ottawa", instagram: "@tradewithindonesia.ca" },
  { office: "Atase Perdagangan Paris", country: "Perancis", email: null, website: "https://kemlu.go.id/paris", instagram: "@atdag.paris" },
  { office: "Atase Perdagangan Roma", country: "Italia", email: null, website: "https://kemlu.go.id/rome", instagram: "@indonesiainrome" },
  { office: "Atase Perdagangan Seoul", country: "Korea Selatan", email: null, website: "https://kemlu.go.id/seoul", instagram: "@indonesiainseoul" },
  { office: "Atase Perdagangan Singapura", country: "Singapura", email: null, website: "https://kemlu.go.id/singapore", instagram: "@atdag.singapura" },
];


const App = () => {
    const [currentPage, setCurrentPage] = React.useState<string>('loginSelection');
    const [previousPage, setPreviousPage] = React.useState<string>('');
    const [userData, setUserData] = React.useState<UserData>({ name: '', email: '', nib: '' });
    const [adminPassword, setAdminPassword] = React.useState('');
    const [productImages, setProductImages] = React.useState<File[]>([]);
    const [productImageUrls, setProductImageUrls] = React.useState<string[]>([]);
    const [productDescription, setProductDescription] = React.useState<string>('');
    const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
    const [marketData, setMarketData] = React.useState<MarketData[]>([]);
    const [selectedCountry, setSelectedCountry] = React.useState<MarketData | null>(null);
    const [regulationData, setRegulationData] = React.useState<RegulationData | null>(null);
    const [promotionText, setPromotionText] = React.useState<string>('');
    const [marketingTips, setMarketingTips] = React.useState<MarketingTips | null>(null);
    const [glossaryData, setGlossaryData] = React.useState<GlossaryTerm[] | null>(null);
    
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [loadingText, setLoadingText] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');

    const ai = React.useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

    const handleBack = () => {
        setError(''); // Clear errors on navigation
        if (currentPage === 'glossary') {
            setCurrentPage(previousPage || 'upload');
            setGlossaryData(null);
            return;
        }
        switch (currentPage) {
            case 'adminDashboard':
                setCurrentPage('loginSelection');
                break;
            case 'ukmLogin':
                setCurrentPage('loginSelection');
                break;
            case 'adminLogin':
                setCurrentPage('loginSelection');
                break;
            case 'upload':
                setCurrentPage('ukmLogin');
                break;
            case 'market':
                setCurrentPage('upload');
                break;
            case 'regulation':
                setCurrentPage('market');
                setRegulationData(null);
                setSelectedCountry(null);
                break;
            case 'promotion':
                setCurrentPage('regulation');
                setPromotionText('');
                break;
            case 'digitalMarketing':
                setCurrentPage('promotion');
                setMarketingTips(null);
                break;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 3);
            if (files.length > 0) {
                setProductImages(files);
                const urls = files.map(file => URL.createObjectURL(file));
                setProductImageUrls(urls);
            }
        }
    };
    
    const analyzeProduct = async () => {
        if (productImages.length === 0) {
            setError("Silakan unggah setidaknya satu foto produk.");
            return;
        }
        setIsLoading(true);
        setLoadingText("Menganalisis gambar dan deskripsi produk untuk menentukan kode HS...");
        setError('');
        setAnalysisResult(null); // Clear previous results

        try {
            const imageParts = await Promise.all(
                productImages.map(async (img) => {
                    const base64img = await fileToBase64(img);
                    return {
                        inlineData: {
                            mimeType: img.type,
                            data: base64img,
                        },
                    };
                })
            );

            const prompt = `You are an expert in international trade and customs classification for Indonesia. Analyze the following product image(s) and user-provided description.
            User Description: "${productDescription || 'Tidak ada deskripsi'}"
            Based on the visual information and context, identify the product.
            - If it's a valid, tradable product, determine the most accurate 6-digit Harmonized System (HS) code. Provide the HS code and a brief, one-sentence description of the product category in Indonesian.
            - If the image does not show a tradable product (e.g., a person, a landscape, an abstract image) or is too unclear to classify, set the hsCode to "N/A" and provide a brief explanation in Indonesian in the description field why it cannot be classified.`;
            
            const analysisSchema = {
                type: Type.OBJECT,
                properties: {
                    hsCode: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["hsCode", "description"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [...imageParts, { text: prompt }]},
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: analysisSchema,
                }
            });
            
            const resultJson = JSON.parse(response.text);

            if (resultJson.hsCode === "N/A" || !/^\d{6}$/.test(resultJson.hsCode)) {
                setError(resultJson.description || "Produk tidak dapat diklasifikasikan. Harap unggah foto produk yang jelas dan merupakan barang yang dapat diperdagangkan.");
                setAnalysisResult(null); 
            } else {
                setAnalysisResult(resultJson);
                setCurrentPage('market');
            }
        } catch (err) {
            console.error(err);
            setError("Gagal menganalisis produk. Pastikan gambar jelas dan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const getMarketRecommendations = async () => {
      if (!analysisResult) return;
      setIsLoading(true);
      setLoadingText(`Mencari pasar potensial untuk produk dengan kode HS: ${analysisResult.hsCode}...`);
      setError('');

      try {
        const schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              annualImport: { type: Type.STRING },
              cagr: { type: Type.STRING },
              tariff: { type: Type.STRING },
              marketPrice: { type: Type.STRING },
              marketPriceTerm: { type: Type.STRING, description: "Istilah Incoterm untuk harga pasar (misalnya FOB, CIF, DDP)." },
              preferences: { type: Type.STRING },
              sourceUrl: { type: Type.STRING },
              localMarketplaces: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["country", "annualImport", "cagr", "tariff", "marketPrice", "marketPriceTerm", "preferences", "sourceUrl"]
          }
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Sebagai analis pasar ekspor, identifikasi 4 pasar ekspor potensial teratas untuk UKM Indonesia yang menjual produk dengan kode HS ${analysisResult.hsCode} (${analysisResult.description}). Untuk setiap negara, berikan:
1. Nama negara dalam Bahasa Indonesia.
2. Nilai impor tahunan (sertakan satuan mata uang seperti USD).
3. CAGR 3 tahun.
4. Tarif impor terendah yang mungkin didapat eksportir Indonesia (sebutkan jika ada FTA atau skema preferensial lainnya).
5. Estimasi harga jual produk di pasar tersebut per satuan (misal: per kg, per buah, per ton) beserta istilah Incoterm-nya (misalnya FOB, CIF, DDP).
6. Ringkasan singkat preferensi konsumen dalam Bahasa Indonesia.
7. Satu URL sumber data utama yang dapat diverifikasi (misalnya dari ITC Trade Map, World Bank, atau situs resmi pemerintah negara terkait).
8. Daftar 2-3 platform e-commerce atau marketplace lokal yang relevan di negara tersebut (jika ada, jika tidak ada biarkan kosong).
Kutip data dari sumber seperti BPS, ITC, WTO, dan data market intelligence.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });

        setMarketData(JSON.parse(response.text));

      } catch (err) {
        console.error(err);
        setError("Gagal mendapatkan rekomendasi pasar. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    React.useEffect(() => {
        if (currentPage === 'market' && analysisResult && marketData.length === 0) {
            getMarketRecommendations();
        }
    }, [currentPage, analysisResult]);

    const getRegulationInfo = async (country: MarketData) => {
        if (!analysisResult) return;
        setSelectedCountry(country);
        setIsLoading(true);
        setLoadingText(`Mencari informasi regulasi untuk ekspor ke ${country.country}...`);
        setError('');

        try {
            const schema = {
                type: Type.OBJECT,
                properties: {
                    documents: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tariffs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    standards: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["documents", "tariffs", "standards"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Sebagai ahli peraturan perdagangan (menggunakan data dari INATRADE/INATRIMS, SNI, BPOM), daftarkan dalam Bahasa Indonesia dokumen wajib, tarif/bea yang berlaku, dan standar teknis/kualitas yang relevan untuk mengekspor produk dengan kode HS ${analysisResult.hsCode} dari Indonesia ke ${country.country}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });

            setRegulationData(JSON.parse(response.text));
            setCurrentPage('regulation');
        } catch (err) {
            console.error(err);
            setError("Gagal mendapatkan informasi regulasi. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const startPromotionOptimization = async () => {
        if (!analysisResult || !selectedCountry) return;
        setIsLoading(true);
        setLoadingText("Mempersiapkan halaman optimasi promosi...");
        setError('');
        try {
            // No image generation needed, just switch page
            setCurrentPage('promotion');
        } catch (err) {
            console.error(err);
            setError("Gagal memulai optimasi promosi.");
        } finally {
            setIsLoading(false);
        }
    };

    const generatePromotionText = async (style: string) => {
        if (!analysisResult || !selectedCountry) return;
        setIsLoading(true);
        setLoadingText(`Membuat caption dengan gaya ${style}...`);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative marketing copywriter for Indonesian SMEs. Create a promotional social media post for "${analysisResult.description}". The target market is ${selectedCountry.country}. The desired tone is ${style}. The post must be in both Indonesian and the primary language of ${selectedCountry.country}. Include relevant hashtags, each prefixed with a '#' symbol, and a strong call-to-action (CTA). The output must be plain text without any Markdown formatting (no asterisks or underscores).`,
            });
            // Clean up any stray markdown characters just in case, but preserve '#'
            const cleanText = response.text.replace(/[*_`]/g, '');
            setPromotionText(cleanText);
        } catch (err) {
            console.error(err);
            setError("Gagal membuat caption. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const getDigitalMarketingTips = async () => {
        if (!analysisResult || !selectedCountry) return;
        setIsLoading(true);
        setLoadingText(`Membuat rekomendasi digital marketing untuk ${selectedCountry.country}...`);
        setError('');

        try {
            const schema = {
                type: Type.OBJECT,
                properties: {
                    platforms: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Platform media sosial atau e-commerce utama yang populer di negara tujuan."
                    },
                    contentStrategy: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Ide-ide strategi konten yang relevan dengan budaya lokal dan produk."
                    },
                    influencerTips: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Tips untuk menemukan dan bekerja sama dengan influencer lokal."
                    },
                    paidAds: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Saran untuk iklan berbayar, termasuk contoh keyword dan target audiens."
                    }
                },
                required: ["platforms", "contentStrategy", "influencerTips", "paidAds"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Sebagai pakar digital marketing internasional, berikan rekomendasi strategi marketing untuk UKM Indonesia yang ingin menjual "${analysisResult.description}" ke pasar ${selectedCountry.country}. Fokus pada tindakan praktis.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });

            setMarketingTips(JSON.parse(response.text));
            setCurrentPage('digitalMarketing');
        } catch (err) {
            console.error(err);
            setError("Gagal mendapatkan rekomendasi marketing. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGlossaryClick = async () => {
        setPreviousPage(currentPage);
        setCurrentPage('glossary');
        if (glossaryData) return; // Don't refetch if already loaded
        
        setIsLoading(true);
        setLoadingText("Menyiapkan glosarium ekspor...");
        setError('');
    
        try {
            const schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING, description: "Penjelasan umum untuk istilah tersebut." },
                        subItems: {
                            type: Type.ARRAY,
                            description: "Daftar poin-poin atau sub-kategori untuk istilah ini (misalnya, jenis-jenis Incoterm). Biarkan kosong jika tidak ada.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Nama dari sub-item (misalnya, 'FOB - Free On Board')." },
                                    detail: { type: Type.STRING, description: "Penjelasan singkat dari sub-item." }
                                },
                                required: ["name", "detail"]
                            }
                        }
                    },
                    required: ["term", "definition"]
                }
            };
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Sebagai ahli perdagangan internasional, jelaskan istilah-istilah ekspor penting berikut dalam Bahasa Indonesia yang mudah dipahami untuk UKM. Untuk setiap istilah, berikan 'definition' umum yang jelas dan ringkas. Jika suatu istilah memiliki beberapa jenis atau kategori (seperti Incoterms, Metode Pembayaran, atau FTA), pecah menjadi poin-poin dalam array 'subItems', masing-masing dengan 'name' (nama/jenis) dan 'detail' (penjelasannya). Jika tidak ada sub-kategori, biarkan 'subItems' sebagai array kosong. Istilahnya adalah:
- Incoterms 2020: Jelaskan secara umum, lalu rinci semua 11 istilah (EXW, FCA, FAS, FOB, CFR, CIF, CPT, CIP, DPU, DAP, DDP) sebagai subItems.
- Metode Pembayaran Ekspor: Jelaskan secara umum, lalu rinci 'Letter of Credit (L/C)', 'Telegraphic Transfer (T/T)', dan 'Advance Payment' sebagai subItems.
- Perjanjian Perdagangan Bebas (FTA): Jelaskan secara umum, lalu rinci FTA utama Indonesia (contoh: AFTA, ACFTA, IJEPA, IA-CEPA, RCEP) sebagai subItems. Sebutkan juga jenis SKA/COO yang relevan di bagian detailnya.
- Pemberitahuan Ekspor Barang (PEB)
- Bill of Lading (B/L)
- Certificate of Origin (COO) / Surat Keterangan Asal (SKA)`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
    
            setGlossaryData(JSON.parse(response.text));
        } catch (err) {
            console.error(err);
            setError("Gagal memuat glosarium. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadImage = () => {
        const imageUrl = productImageUrls[0];
        if (!imageUrl) return;
    
        const image = new Image();
        image.crossOrigin = 'anonymous'; 
        image.src = imageUrl;
    
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
    
            // Apply the same filter as the CSS
            ctx.filter = 'brightness(1.1) contrast(1.1)';
    
            // Draw the image onto the canvas
            ctx.drawImage(image, 0, 0);
    
            // Trigger download
            const link = document.createElement('a');
            link.download = `enhanced-${productImages[0]?.name || 'product'}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        };
    
        image.onerror = () => {
            alert('Gagal memuat gambar untuk diunduh. Coba muat ulang halaman.');
        }
    };

    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopyText = () => {
        if (!promotionText) return;
        navigator.clipboard.writeText(promotionText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Gagal menyalin teks: ', err);
            alert('Gagal menyalin teks.');
        });
    };

    const handleAnalyzeAnotherProduct = () => {
        // Reset all product-specific state but keep user data
        setProductImages([]);
        setProductImageUrls([]);
        setProductDescription('');
        setAnalysisResult(null);
        setMarketData([]);
        setSelectedCountry(null);
        setRegulationData(null);
        setPromotionText('');
        setMarketingTips(null);
        // Do not reset glossaryData as it's global now
        setActiveStyle('Friendly');
        setError('');
    
        // Go back to the upload page for a new analysis
        setCurrentPage('upload');
    };
    
    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminPassword === "Indonesia#1") {
            setError('');
            setAdminPassword('');
            setCurrentPage('adminDashboard');
        } else {
            setError("Kata sandi salah. Silakan coba lagi.");
        }
    }

    const renderLoader = () => (
        <div className="loader-overlay">
            <div style={{textAlign: 'center'}}>
                <div className="loader"></div>
                {loadingText && <p className="loader-text">{loadingText}</p>}
            </div>
        </div>
    );
    
    const renderBackButton = () => (
        <button className="btn-back" onClick={handleBack}>
            &larr; Kembali
        </button>
    );

    const renderFooter = () => (
        <div className="footer">
            <p className="support-text">Didukung oleh Kementerian Perdagangan</p>
        </div>
    );

    const renderLoginSelection = () => (
        <div className="container splash-screen">
            <div className="logo">PanoramiX</div>
            <p className="header-p">Asisten Ekspor AI untuk UKM Indonesia</p>
            <div className="role-selection">
                <button className="btn" onClick={() => setCurrentPage('ukmLogin')}>
                    Saya Pelaku UKM
                </button>
                <button className="btn btn-outline" onClick={() => setCurrentPage('adminLogin')}>
                    Saya Admin
                </button>
            </div>
            <div className="footer" style={{paddingBottom: '2rem'}}>
                <p className="support-text">Didukung oleh Kementerian Perdagangan</p>
            </div>
        </div>
    );

    const renderAdminLogin = () => (
        <div className="container">
            {renderBackButton()}
            <div className="header">
                <h1>Login Admin</h1>
                <p>Masukkan kata sandi untuk mengakses dasbor.</p>
            </div>
            <form onSubmit={handleAdminLogin}>
                <div className="form-group">
                    <label htmlFor="adminPassword">Kata Sandi</label>
                    <input type="password" id="adminPassword" name="adminPassword" required onChange={(e) => setAdminPassword(e.target.value)} />
                </div>
                 {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn">Masuk</button>
            </form>
            {renderFooter()}
        </div>
    );

    const renderAdminDashboard = () => {
        // Mock data for demonstration
        const mockUsers = {
            total: 1250,
            locations: [
                { province: "Jawa Barat", count: 350 },
                { province: "DKI Jakarta", count: 280 },
                { province: "Jawa Timur", count: 210 },
                { province: "Jawa Tengah", count: 150 },
                { province: "Sumatera Utara", count: 80 },
                { province: "Lainnya", count: 180 },
            ],
            maxCount: 350,
        };
        const mockExports = {
            totalValue: 5250000, // in USD
            transactions: 480,
        };

        return (
             <div className="container admin-dashboard">
                <div className="header">
                    <h2>Dasbor Admin</h2>
                    <p>Ringkasan aktivitas pengguna dan realisasi ekspor.</p>
                </div>
                
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-label">Total Pengguna UKM</div>
                        <div className="kpi-value">{mockUsers.total.toLocaleString('id-ID')}</div>
                    </div>
                     <div className="kpi-card">
                        <div className="kpi-label">Transaksi Ekspor</div>
                        <div className="kpi-value">{mockExports.transactions.toLocaleString('id-ID')}</div>
                    </div>
                     <div className="kpi-card wide">
                        <div className="kpi-label">Total Nilai Realisasi Ekspor</div>
                        <div className="kpi-value">
                            $ {mockExports.totalValue.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Sebaran Lokasi Pengguna</h3>
                    <div className="location-chart">
                        {mockUsers.locations.map(loc => (
                             <div key={loc.province} className="chart-item">
                                <div className="chart-label">{loc.province} ({loc.count})</div>
                                <div className="chart-bar-container">
                                    <div 
                                        className="chart-bar"
                                        style={{ width: `${(loc.count / mockUsers.maxCount) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="info-note" style={{marginTop: '2rem'}}>
                    <strong>Catatan:</strong> Data di atas merupakan simulasi untuk tujuan demonstrasi. Integrasi langsung dengan data NIB dan Bea Cukai memerlukan akses sistem resmi.
                </p>
                <button className="btn btn-outline" style={{marginTop: '1rem'}} onClick={handleBack}>Keluar</button>
             </div>
        )
    };
    
    const renderUkmLogin = () => (
        <div className="container">
            {renderBackButton()}
            <div className="header">
                <h1>Selamat Datang</h1>
                <p>Masukkan data Anda untuk memulai.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setCurrentPage('upload'); }}>
                <div className="form-group">
                    <label htmlFor="name">Nama Lengkap</label>
                    <input type="text" id="name" name="name" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Aktif</label>
                    <input type="email" id="email" name="email" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="nib">NIB (Nomor Induk Berusaha)</label>
                    <input type="text" id="nib" name="nib" required pattern="\d+" title="NIB harus berupa angka" onChange={handleInputChange} />
                </div>
                <p className="privacy-note">🔒 Data Anda disimpan dengan aman. Tidak ada informasi yang dibagikan ke pihak ketiga tanpa izin Anda.</p>
                <button type="submit" className="btn">Lanjut</button>
            </form>
            {renderFooter()}
        </div>
    );

    const renderUpload = () => (
        <div className="container">
             {renderBackButton()}
             <div className="header">
                <h2>Unggah Foto Produk</h2>
                <p>Unggah 1-3 foto dan tambahkan deskripsi singkat untuk hasil terbaik.</p>
            </div>
            {error && <p className="error-message">{error}</p>}
            <input type="file" id="file-upload" accept="image/png, image/jpeg" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            <label htmlFor="file-upload" className="upload-area">
                <p>Ketuk untuk memilih gambar (.jpg/.png)</p>
            </label>
            {productImageUrls.length > 0 && (
                <div className="image-preview-container">
                    {productImageUrls.map((url, index) => (
                        <img key={index} src={url} alt={`pratinjau ${index+1}`} className="image-preview" />
                    ))}
                </div>
            )}
            <div className="form-group" style={{marginTop: '1.5rem'}}>
                <label htmlFor="productDescription">Karakteristik Produk (Opsional)</label>
                <textarea 
                    id="productDescription"
                    rows={3}
                    placeholder="Contoh: Baju batik katun lengan panjang untuk pria, motif parang"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
            </div>

            {analysisResult && (
                 <div className="result-card">
                    <h3>Hasil Analisis Awal:</h3>
                    <p>{analysisResult.hsCode}</p>
                    <p className="description">{analysisResult.description}</p>
                </div>
            )}
            <button className="btn btn-secondary" onClick={analyzeProduct} disabled={productImages.length === 0}>
                Mulai Analisis
            </button>
            {renderFooter()}
        </div>
    );

    const renderMarket = () => (
        <div className="container">
            {renderBackButton()}
            <div className="header">
                <h2>Rekomendasi Pasar Potensial</h2>
                <p>Berdasarkan produk: <strong>{analysisResult?.description}</strong> (HS: {analysisResult?.hsCode}), berikut negara tujuan yang menjanjikan.</p>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div>
                {marketData.map((country, index) => {
                    const representatives = tradeRepresentatives.filter(
                        rep => rep.country.toLowerCase() === country.country.toLowerCase()
                    );
                    return (
                        <div key={index} className="country-card">
                            <div className="country-card-header">
                                <h3>{index+1}. {country.country}</h3>
                                <a href={country.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                                    Cek Sumber
                                </a>
                            </div>
                            <div className="country-grid">
                                <div className="grid-item">
                                    <div className="label">Impor Tahunan</div>
                                    <div className="value">{country.annualImport}</div>
                                </div>
                                <div className="grid-item">
                                    <div className="label">CAGR (3 Thn)</div>
                                    <div className="value">{country.cagr}</div>
                                </div>
                                 <div className="grid-item">
                                    <div className="label">Tarif Terendah</div>
                                    <div className="value">{country.tariff}</div>
                                </div>
                                 <div className="grid-item">
                                    <div className="label">Harga di Pasar</div>
                                    <div className="value">{country.marketPrice} <span className="price-term">({country.marketPriceTerm})</span></div>
                                </div>
                            </div>
                            <p className="preferences"><strong>Preferensi Konsumen:</strong> {country.preferences}</p>
                            
                             {country.localMarketplaces && country.localMarketplaces.length > 0 && (
                                <div className="marketplace-section">
                                    <h4>Rekomendasi Marketplace Lokal</h4>
                                    <ul className="info-list">
                                        {country.localMarketplaces.map((mp, i) => (
                                            <li key={i}>{mp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {representatives.length > 0 && (
                                <div className="representative-section">
                                    <h4>Kontak Perwakilan Dagang RI</h4>
                                    {representatives.map((rep) => (
                                        <div key={rep.office} className="representative-contact">
                                            <p><strong>{rep.office}</strong></p>
                                            {rep.email && <p>Email: <a href={`mailto:${rep.email}`}>{rep.email}</a></p>}
                                            {rep.website && <p>Website: <a href={rep.website} target="_blank" rel="noopener noreferrer">{rep.website}</a></p>}
                                            {rep.instagram && <p>Instagram: <a href={`https://instagram.com/${rep.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">{rep.instagram}</a></p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="btn" style={{marginTop: '1rem'}} onClick={() => getRegulationInfo(country)}>
                                Pilih Negara & Lihat Regulasi
                            </button>
                        </div>
                    );
                })}
            </div>
            <button className="btn btn-outline" onClick={handleGlossaryClick}>
                Lihat Glosarium Istilah Ekspor
            </button>
             <p className="info-note">Untuk keterangan lebih detil dapat menghubungi perwakilan perdagangan di negara tujuan ekspor.</p>
            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '1rem'}}>*Data dianalisis dari berbagai sumber termasuk BPS, ITC, dan WTO.</p>
            {renderFooter()}
        </div>
    );

    const renderRegulation = () => (
         <div className="container">
            {renderBackButton()}
            <div className="header">
                <h2>Informasi Regulasi & Promosi</h2>
                <p>Berikut adalah informasi penting untuk ekspor ke <strong>{selectedCountry?.country}</strong>.</p>
            </div>
            {regulationData && (
                <div>
                    <div className="info-section">
                        <h3>Dokumen Wajib</h3>
                        <ul className="info-list">
                            {regulationData.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                        </ul>
                    </div>
                    <div className="info-section">
                        <h3>Tarif & Bea Masuk</h3>
                         <ul className="info-list">
                            {regulationData.tariffs.map((tariff, i) => <li key={i}>{tariff}</li>)}
                        </ul>
                    </div>
                     <div className="info-section">
                        <h3>Standar Teknis & Kualitas</h3>
                         <ul className="info-list">
                            {regulationData.standards.map((std, i) => <li key={i}>{std}</li>)}
                        </ul>
                    </div>
                </div>
            )}
             <button className="btn btn-secondary" onClick={startPromotionOptimization}>Lanjut ke Optimasi Promosi</button>
             <button className="btn btn-outline" onClick={handleGlossaryClick}>
                Lihat Glosarium Istilah Ekspor
             </button>
             <p style={{fontSize: '0.8rem', color: '#888', marginTop: '2rem'}}>*Informasi bersumber dari INATRIMS, SNI, BPOM, dan basis data perdagangan terkait.</p>
             {renderFooter()}
        </div>
    );

    const [activeStyle, setActiveStyle] = React.useState('Friendly');
    const handleStyleClick = (style: string) => {
        setActiveStyle(style);
        generatePromotionText(style);
    }

    const renderPromotion = () => (
        <div className="container">
            {renderBackButton()}
            <div className="header">
                <h2>Optimasi Promosi Produk</h2>
                <p>Tingkatkan daya tarik visual dan caption marketing produk Anda.</p>
            </div>
            
            <div className="info-section" style={{textAlign: 'center'}}>
                <h3>Penyempurnaan Visual</h3>
                <p style={{marginBottom: '1rem', fontSize: '0.9rem', color: '#666'}}>Gambar asli Anda ditingkatkan dengan penyesuaian kecerahan dan kontras.</p>
                <div className="comparison-view">
                    <div>
                        <h4>Sebelum</h4>
                        <img src={productImageUrls[0]} alt="Original product" />
                    </div>
                    <div>
                        <h4>Sesudah</h4>
                        <img src={productImageUrls[0]} alt="Enhanced product" className="enhanced-image"/>
                    </div>
                </div>
            </div>

            <div className="info-section">
                 <div className="caption-header">
                    <h3>Buat Caption Marketing</h3>
                    <button className="btn-copy" onClick={handleCopyText} disabled={!promotionText}>
                        {isCopied ? 'Tersalin!' : 'Salin Teks'}
                    </button>
                </div>
                <div className="style-selector">
                    {['Friendly', 'Profesional', 'Inspiratif'].map(style => (
                        <button 
                            key={style} 
                            className={`style-btn ${activeStyle === style ? 'active' : ''}`}
                            onClick={() => handleStyleClick(style)}
                        >
                            {style}
                        </button>
                    ))}
                </div>
                <div className="promotion-output">
                    {isLoading && !promotionText ? 'Membuat caption...' : promotionText || "Pilih gaya di atas untuk membuat caption..."}
                </div>
            </div>

            <button className="btn" onClick={handleDownloadImage} disabled={productImageUrls.length === 0}>
                Unduh Gambar
            </button>
             <button className="btn btn-secondary" onClick={getDigitalMarketingTips}>
                Lanjut ke Tips Marketing
            </button>
            {renderFooter()}
        </div>
    );

    const renderDigitalMarketing = () => (
        <div className="container">
           {renderBackButton()}
           <div className="header">
               <h2>Rekomendasi Digital Marketing</h2>
               <p>Strategi untuk menjangkau pelanggan di <strong>{selectedCountry?.country}</strong>.</p>
           </div>
           {marketingTips && (
               <div>
                   <div className="info-section">
                       <h3>Platform Utama</h3>
                       <ul className="info-list">
                           {marketingTips.platforms.map((tip, i) => <li key={i}>{tip}</li>)}
                       </ul>
                   </div>
                   <div className="info-section">
                       <h3>Strategi Konten</h3>
                       <ul className="info-list">
                           {marketingTips.contentStrategy.map((tip, i) => <li key={i}>{tip}</li>)}
                       </ul>
                   </div>
                    <div className="info-section">
                       <h3>Tips Influencer</h3>
                        <ul className="info-list">
                           {marketingTips.influencerTips.map((tip, i) => <li key={i}>{tip}</li>)}
                       </ul>
                   </div>
                    <div className="info-section">
                       <h3>Iklan Berbayar</h3>
                        <ul className="info-list">
                           {marketingTips.paidAds.map((tip, i) => <li key={i}>{tip}</li>)}
                       </ul>
                   </div>
               </div>
           )}
            <button className="btn" onClick={handleAnalyzeAnotherProduct}>
               Analisis Produk Lainnya
            </button>
            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '2rem'}}>*Rekomendasi ini dibuat oleh AI dan harus divalidasi dengan riset pasar lebih lanjut.</p>
            {renderFooter()}
       </div>
    );

    const renderGlossary = () => (
        <div className="container">
            {renderBackButton()}
            <div className="header">
                <h2>Glosarium Ekspor</h2>
                <p>Istilah-istilah penting dalam dunia ekspor.</p>
            </div>
             {error && <p className="error-message">{error}</p>}
            {glossaryData && (
                <div className="glossary-container">
                    {glossaryData.map((item, index) => (
                        <div key={index} className="glossary-card">
                            <h3>{item.term}</h3>
                            <p className="glossary-definition">{item.definition}</p>
                            {item.subItems && item.subItems.length > 0 && (
                                <ul className="sub-items-list">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex} className="sub-item">
                                            <strong className="sub-item-name">{subItem.name}</strong>
                                            <p className="sub-item-detail">{subItem.detail}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '2rem' }}>*Definisi ini dibuat oleh AI untuk tujuan edukasi dan mungkin perlu diverifikasi lebih lanjut.</p>
            {renderFooter()}
        </div>
    );

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'ukmLogin': return renderUkmLogin();
            case 'adminLogin': return renderAdminLogin();
            case 'adminDashboard': return renderAdminDashboard();
            case 'upload': return renderUpload();
            case 'market': return renderMarket();
            case 'regulation': return renderRegulation();
            case 'promotion': return renderPromotion();
            case 'digitalMarketing': return renderDigitalMarketing();
            case 'glossary': return renderGlossary();
            case 'loginSelection':
            default:
                return renderLoginSelection();
        }
    };

    return (
        <>
          {isLoading && renderLoader()}
          {renderCurrentPage()}
        </>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}