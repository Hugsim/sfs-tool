export type RiksdagenResponse = {
    dokumentlista: Dokumentlista
}

export type Dokumentlista = {
    "@ms": string
    "@version": string
    "@q": string
    "@varning": string
    "@datum": string
    "@nasta_sida": string
    "@sida": string
    "@sidor": string
    "@traff_fran": string
    "@traff_till": string
    "@traffar": string
    "@dPre": string
    "@dSol": string
    "@dDt": string
    "@dR": string
    facettlista: any
    dokument: Array<Dokument>
}

export type Dokument = {
    traff: string
    domain: string
    database: string
    datum: string
    id: string
    rdrest: any
    slutdatum: string
    rddata: any
    plats: string
    klockslag: string
    publicerad: string
    systemdatum: string
    undertitel: string
    kalla: string
    kall_id: string
    dok_id: string
    dokumentformat: string
    dokument_url_text: string
    dokument_url_html: string
    inlamnad: string
    motionstid: string
    tilldelat: string
    lang: string
    url: string
    relurl: string
    titel: string
    rm: string
    organ: string
    relaterat_id: string
    doktyp: string
    typ: string
    subtyp: string
    beteckning: string
    tempbeteckning: string
    nummer: string
    status: string
    score: string
    sokdata: Sokdata
    summary: string
    notisrubrik: string
    notis: string
    dokintressent: any
    filbilaga: any
    avdelning: string
    avdelningar: Avdelningar
    struktur: string
    audio: string
    video: string
    debattgrupp: string
    debattdag: string
    beslutsdag: string
    beredningsdag: string
    justeringsdag: string
    beslutad: string
    debattsekunder: string
    ardometyp: string
    reservationer: string
    debatt: any
    debattnamn: string
    dokumentnamn: string
}

export type Sokdata = {
    titel: string
    undertitel: string
    soktyp: string
    statusrad: string
    brodsmula: string
    parti_kod: string
    parti_namn: string
    parti_website_url: string
    parti_website_namn: string
    parti_epost: string
    parti_telefon: string
    parti_telefontider: string
    parti_logotyp_img_id: string
    parti_logotyp_img_url: string
    parti_logotyp_img_alt: string
    parti_mandat: string
    kalenderprio: string
}

export type Avdelningar = {
    avdelning: Array<string>
}
