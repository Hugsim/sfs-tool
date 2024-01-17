import type { RiksdagenResponse, Dokument, Dokumentlista } from "./model/RiksdagenResponse";
import { Storage } from "./storage-lib/storage";

const storage = new Storage<Dokument>("./storage");
const saveResponse = async (r: RiksdagenResponse): Promise<void> => {
    for (const d of r.dokumentlista.dokument) {
        console.log(`Saved ${d.dok_id}!`);
        await storage.set(d.dok_id, d);
        const doc: Dokument = await storage.get(d.dok_id);
        console.log(`Read back id ${doc.id}`);
    }
};

var url: string = "https://data.riksdagen.se/dokumentlista/?sok=&doktyp=SFS&sort=datum&sortorder=desc&utformat=json";
while (true) {
    const response = await fetch(url);
    const res: RiksdagenResponse = await response.json() as RiksdagenResponse;
    saveResponse(res);
    console.log(`Saved ${res.dokumentlista["@traff_till"]}`)
    const nextUrl: string = res.dokumentlista["@nasta_sida"];
    if (nextUrl === url) {
        break;
    }
    url = nextUrl;
}


