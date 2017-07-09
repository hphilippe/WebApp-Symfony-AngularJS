<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Categorymultimedia
 *
 * @ORM\Table(name="categorymultimedia")
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/categorymultimedia/' ~ object.getId())")
 */
class Categorymultimedia
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_categoryMultimedia", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=150, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="fa_icone", type="string", length=45, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $faIcone;

    /**
     * @var string
     *
     * @ORM\Column(name="pathCoverImage", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathcoverimage;



    /**
     * Get idCategorymultimedia
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Categorymultimedia
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set faIcone
     *
     * @param string $faIcone
     * @return Categorymultimedia
     */
    public function setFaIcone($faIcone)
    {
        $this->faIcone = $faIcone;

        return $this;
    }

    /**
     * Get faIcone
     *
     * @return string 
     */
    public function getFaIcone()
    {
        return $this->faIcone;
    }

    /**
     * Set pathcoverimage
     *
     * @param string $pathcoverimage
     * @return Categorymultimedia
     */
    public function setPathcoverimage($pathcoverimage)
    {
        $this->pathcoverimage = $pathcoverimage;

        return $this;
    }

    /**
     * Get pathcoverimage
     *
     * @return string 
     */
    public function getPathcoverimage()
    {
        return $this->pathcoverimage;
    }
}
