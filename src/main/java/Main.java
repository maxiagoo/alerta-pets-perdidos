import io.javalin.Javalin;
import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<Pet> pets = new ArrayList<>();

    public static void main(String[] args) {

        Javalin app = Javalin.create(config -> {

            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    it.anyHost();
                });
            });

        }).start(7000);

        app.get("/", ctx -> {
            ctx.result("Backend rodando com sucesso!");
        });

        app.get("/pets", ctx -> {
            ctx.json(pets);
        });

        app.post("/pets", ctx -> {

            Pet pet = ctx.bodyAsClass(Pet.class);

            pet.id = pets.size() + 1;

            pets.add(pet);

            System.out.println("Pet cadastrado: " + pet.nome);

            ctx.json(pet);
        });

        System.out.println("=================================");
        System.out.println("API de Pets rodando na porta 7000");
        System.out.println("http://localhost:7000");
        System.out.println("=================================");
    }
}