import Image from "next/image";

export default function Page() {
  return (
    <main className="container mx-auto p-4">
      <h1>About me</h1>
      <div className="relative flex">
  <Image 
    src="/shento-image.png" 
    width={500} /* Replace with your image's actual width */
    height={300} /* Replace with your image's actual height */
    className="object-cover h-auto w-full" 
    alt="Shento image"
  />
</div> 
      <p>Hey, I'm Shento. I'm a Web Developer and Communication & Multimedia Design student at Zuyd University in Maastricht, The Netherlands.</p>
       
      <p>My journey into programming started at age 8 when I wanted to create my own games. I even used Python to automate my parents' inbox cleaning (they were thrilled, I'm sure). Now I work primarily with React, Next.js, and Tailwind CSS, blending my passion for clean code with thoughtful UI/UX design.</p>
      
      <p>I believe in the intersection of development and design. While I love crafting interactive experiences with code, I'm equally passionate about typography, user interfaces, and making things that are both beautiful and functional. You'll often find me in Figma, sketching out ideas before bringing them to life.</p>
      
      <p>This blog is where I share interesting techniques and solutions I discover along the way. My philosophy is simple: keep it concise, provide clean foundations, and let you build upon them. I intentionally keep my code examples minimal and unopinionated—just the essentials you need to understand the concept and make it your own.</p>
      
      <p>When I'm not coding or designing, you'll find me taking walks through Limburg, diving into a good book, or exploring whatever rabbit hole has caught my curiosity that week. I'm always learning something new—it's what keeps this field exciting.</p>
      
      <p>Feel free to explore my tutorials and experiments. I hope you find something useful for your own projects!</p>
    </main>
  );
}
