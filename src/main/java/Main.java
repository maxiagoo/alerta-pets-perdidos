import io.javalin.Javalin;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) {

        Javalin app = Javalin.create(config -> {

            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    it.anyHost();
                });
            });

        }).start(7000);

        System.out.println("=================================");
        System.out.println("API de Pets rodando na porta 7000");
        System.out.println("http://localhost:7000");
        System.out.println("=================================");

        // ===============================
        // TESTE BACKEND
        // ===============================
        app.get("/", ctx -> {
            ctx.result("Backend rodando com sucesso!");
        });

        // ===============================
        // LISTAR PETS (MYSQL)
        // ===============================
        app.get("/pets", ctx -> {

            Connection conn = DB.getConnection();

            var stmt = conn.prepareStatement("SELECT * FROM pets");

            ResultSet rs = stmt.executeQuery();

            List<Pet> lista = new ArrayList<>();

            while (rs.next()) {

                Pet p = new Pet();

                p.id = rs.getInt("id");
                p.nome = rs.getString("nome");
                p.raca = rs.getString("raca");
                p.telefone = rs.getString("telefone");
                p.descricao = rs.getString("descricao");
                p.foto = rs.getString("foto");
                p.cidade = rs.getString("cidade");
                p.bairro = rs.getString("bairro");
                p.dataPerda = rs.getString("dataPerda");
                p.usuario = rs.getString("usuario");

                lista.add(p);
            }

            ctx.json(lista);
        });

        // ===============================
        // CADASTRAR PET (MYSQL)
        // ===============================
        app.post("/pets", ctx -> {

            Pet pet = ctx.bodyAsClass(Pet.class);

            Connection conn = DB.getConnection();

            String sql = "INSERT INTO pets (nome,raca,telefone,descricao,foto,cidade,bairro,dataPerda,usuario) VALUES (?,?,?,?,?,?,?,?,?)";

            var stmt = conn.prepareStatement(sql);

            stmt.setString(1, pet.nome);
            stmt.setString(2, pet.raca);
            stmt.setString(3, pet.telefone);
            stmt.setString(4, pet.descricao);
            stmt.setString(5, pet.foto);
            stmt.setString(6, pet.cidade);
            stmt.setString(7, pet.bairro);
            stmt.setString(8, pet.dataPerda);
            stmt.setString(9, pet.usuario);

            stmt.executeUpdate();

            ctx.status(201).json(pet);
        });
    }
}